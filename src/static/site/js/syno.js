/*d3 viz mostly based on https://bl.ocks.org/mbostock/4062045*/

var svg = d3.select("svg");
var width = 1000;
var height = 800;
var indexname = "ordered_entries"
var color = d3.scaleOrdinal(d3.schemeCategory20);
var nodes = [];
var links = [];
var dbg = true;

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) {
    return d.id;
  }).distance(function(d) {
    var rand = 60 + Math.floor(Math.random() * 260)
    //return rand; // to disperse nodes
    return d.value;
  }))
  .force("charge", d3.forceManyBody(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));

/************************************
              Show Lemma List
*************************************/
addLoader("main");
var esClient = new $.es.Client({
  host: 'http:\/\/localhost:9200'
});

esClient.search({
  index: indexname,
  body: bodyAllLemmaWithSynRefs()
}).then(function(body) {
  var hits = body.hits.hits;
  removeLoader("main");
  for (i = 0; i < hits.length; i++) {
    var entry = hits[i]._source.array[0].array[0].arr_orth[1];
    var lemma = entry.text; //tdo: show Nebenlemma
    var volume = entry.volume;
    $("#lemma-list ul").append('<li><a  onclick=\'clearGraphData();findSynonyms(' + hits[i]._id + ');\' id=' + hits[i]._id + ' v=' + volume + '>' + lemma + '</a></li>');
  }
}, function(error) {
  if (dbg) console.trace(error.message);
  removeLoader("main");
});


/************************************
          Main Functions
*************************************/

function findSynonyms(entryID, connectID) {

  restartGraph();

  var volume = $("#lemma-list #" + entryID).attr("v");

  var ninfo = [];
  ninfo.push({
    key: "Type",
    value: "Mainlemma"
  });
  ninfo.push({
    key: "Band",
    value: volume
  });
  ninfo.push({
    key: "Person",
    value: "n/s"
  });

  var centernode = {
    id: "hl_" + entryID,
    group: 1,
    label: $("#lemma-list #" + entryID).text(),
    info: ninfo
  }
  addToNodes(centernode);

  addLoader("graph");
  esClient.search({
      index: indexname,
      body: bodySynonymsOfLemma(entryID)
    })
    .then(function(centernode, connectID, body) {
      var hits = body.hits.hits;
      removeLoader("graph");
      var compnode = centernode;

      for (i = 0; i < hits[0]._source.array.length; i++) {
        compnode = crawlSynResultsRecursive(hits[0]._source.array[i], centernode, compnode)
      }

      if (connectID !== "" && connectID !== undefined) {
        connectNodesAsync(connectID);
        restartGraph();
      }
      renderGraph();
    }.bind(null, centernode, connectID), function(error) {
      if (dbg) console.trace(error.message);
      removeLoader("graph");
      showError("graph");
    });
}

function crawlSynResultsRecursive(a, centernode, compnode) {

  if (a.hasOwnProperty('array')) {
    for (var j = 0, count = a.array.length; j < count; j++) {
      compnode = crawlSynResultsRecursive(a.array[j], centernode, compnode);
    }
  }

  if (a.hasOwnProperty('arr_oRef')) {

    var typeinfo = a.arr_oRef.find(o => o.hasOwnProperty("orig"));
    var content = a.arr_oRef.find(o => o.hasOwnProperty("text") && o.text != "oRef")

    if (typeinfo !== undefined && content !== undefined && typeinfo.orig.indexOf("komp") !== -1) {
      compnode = addNodeToGraph(content, centernode, typeinfo, compnode, true)
    }

    if (typeinfo !== undefined && content !== undefined && typeinfo.orig.indexOf("syn") !== -1) {
      compnode = addNodeToGraph(content, centernode, typeinfo, compnode, false)
    }

    for (var m = 0, count = a.arr_oRef.length; m < count; m++) {
      compnode = crawlSynResultsRecursive(a.arr_oRef[m], centernode, compnode);
    }
  }

  return compnode;
}

function addNodeToGraph(content, centernode, typeinfo, compnode, fComp) {
  var sourcenode = {};
  if (fComp) sourcenode = centernode;
  else sourcenode = compnode;

  var ninfo = [];
  var nn = {};
  nn.id = centernode.id + "_" + content.order;
  nn.order = content.order;
  nn.indexid = centernode.id;
  if (fComp)
    nn.group = 2;
  else nn.group = 3;
  nn.label = content.text;
  ninfo.push({
    key: "Tag",
    value: "Ref"
  });
  ninfo.push({
    key: "Band",
    value: content.volume
  });
  ninfo.push({
    key: "Page",
    value: typeinfo.location
  });
  ninfo.push({
    key: "Person",
    value: "n/s"
  });
  nn.info = ninfo;
  addToNodes(nn);

  var linkvalue = 100;
  if (fComp) linkvalue = 130;

  var refType = "Syn. Ref.";
  if (fComp) refType = "Composite";

  info = [];
  info.push({
    key: "Type",
    value: refType
  });
  info.push({
    key: "Orig",
    value: typeinfo.orig
  });
  info.push({
    key: "Page",
    value: typeinfo.location
  });
  var nl = {
    value: linkvalue,
    source: sourcenode.id,
    target: centernode.id + "_" + content.order,
    info: info,
    sourceinfo: ninfo,
    targetinfo: ninfo
  }
  addToLinks(nl);
  if (fComp) {
    return nn;
  }
  return sourcenode;
}

function colorSuggestions(node) {

  esClient.search({
      index: indexname,
      body: bodyCheckIfLemmaEntry(node.label)
    })
    .then(function(node, sbody) {

      var hits = sbody.hits.hits;
      if (hits.length > 0) {
        var elem = $("svg text:contains('" + node.label + "')").attr("fill", "red");
      }

    }.bind(null, node), function(error) {
      if (dbg) console.trace(error.message);
    });

}

function getSearchResults(node) {

  $(".foundLemma").empty();
  $(".foundLemma").hide();
  $(".foundRefs").empty();
  $(".foundRefs").hide();

  /***************Lemma list***************/
  addLoader("lemma");
  esClient.search({
      index: indexname,
      body: bodyLemmaSuggForSyn(node.label)
    })
    .then(function(node, sbody) {

      var hits = sbody.hits.hits;
      removeLoader("lemma");
      if (hits.length > 0) {
        for (i = 0; i < hits.length; i++) {
          crawlSearchResultsRecursive(hits[i]._source, hits[i]._id, node.label);
        }
      } else $(".foundLemma").append("<li>Anzahl: 0</li>");

    }.bind(null, node), function(error) {
      if (dbg) console.trace(error.message);
      removeLoader("lemma");
      showError("lemma");
    });

  /***************Ref list***************/
  addLoader("ref");
  esClient.search({
      index: indexname,
      body: bodyRefSuggForSyn(node.label)
    })
    .then(function(node, mbody) {
        var hits = mbody.hits.hits;
        removeLoader("ref");
        if (hits.length > 0) {
          for (i = 0; i < hits.length; i++) {
            crawlSearchResultsRecursive(hits[i]._source, hits[i]._id, node.label);
          }

        } else $(".foundRefs").append("<li>Anzahl: 0</li>");
      }.bind(null, node),
      function(error) {
        if (dbg) console.trace(error.message);
        removeLoader("ref");
        showError("ref");
      });

  $(".foundLemma").slideFadeToggle();
  $(".foundRefs").slideFadeToggle();
}

function crawlSearchResultsRecursive(a, id, searchterm) {

  if (a.hasOwnProperty('array')) {
    for (var j = 0, count = a.array.length; j < count; j++) {
      if (a.array[j].hasOwnProperty('text')) {}
      crawlSearchResultsRecursive(a.array[j], id, searchterm);
    }
  }

  if (a.hasOwnProperty('arr_orth')) {
    for (var k = 0, count = a.arr_orth.length; k < count; k++) {
      if (a.arr_orth[k].hasOwnProperty('text')) {
        addSearchResult(a.arr_orth[k].text, id, searchterm);
      }
      crawlSearchResultsRecursive(a.arr_orth[k], id, searchterm);
    }
  }

  if (a.hasOwnProperty('arr_oRef')) {

    var typeinfo = a.arr_oRef.find(o => o.hasOwnProperty("type"));
    for (var m = 0, count = a.arr_oRef.length; m < count; m++) {
      if (a.arr_oRef[m].hasOwnProperty('text') && typeinfo !== undefined) {
        addSearchResultRefList(a.arr_oRef[m].text, id, a.arr_oRef[m].order, searchterm);
      }
      crawlSearchResultsRecursive(a.arr_oRef[m], id, searchterm);
    }
  }
}

function addSearchResult(text, id, searchterm) {
  if (text === "oRef" || text === "orth" || text === " " || text === "re") return;
  $(".foundLemma").append("<li><a onclick='selectResult(1," + id + ",0, \"" + text + "\");' id='lem" + id + "'>" + text + "</a></li>");
}

function addSearchResultRefList(text, id, order, searchterm) {
  if (text === "oRef" || text === "orth" || text === " " || text === "re") return;
  if (text.indexOf(searchterm) === -1 && text.indexOf(refineSearchString1(searchterm)) === -1) return;

  var selected = $("#lemma-list a[id='" + id + "']");
  var mainentry = "n/s";
  if (selected !== undefined && selected.length !== 0) {
    mainentry = selected[0].innerHTML;
  }
  $(".foundRefs").append("<li><a onclick='selectResult(2," + id + "," + order + " , \"" + mainentry + "\");' class='sy" + id + "' id='sy" + order + "'>" + text + " (" + mainentry + ")</a></li>");

}

function selectResult(search, id, order, searchlemma) {

  $(".foundRefs a").removeClass("selected");
  $(".foundLemma a").removeClass("selected");
  $("#showXML").attr("onclick", "''");

  if (search === 1) {
    $("#lem" + id).addClass("selected");
  }
  if (search === 2) {
    $("#sy" + order).addClass("selected");
  }

  $("#showXML").attr("onclick", "showXML('" + searchlemma + "');");
}

function showXML(lemma) {

  if (lemma == "") return;

  for (i = 0; i < entryColl.length; i++) {
    var entry = entryColl[i];
    var text = entry.getElementsByTagName("orth")[0].innerHTML;

    if (text === lemma) {

      var xmloutput = entry.innerHTML.replace(/\&/g, "&amp").replace(/\</g, "&lt").replace(/\>/g, "&gt");
      xmloutput = xmloutput.replace(new RegExp(lemma, 'g'), "<span style='background-color:yellow';>" + lemma + "</span>");
      var synref = "syn1_HL";
      xmloutput = xmloutput.replace(new RegExp(synref, 'g'), "<span style='background-color:orange';>" + synref + "</span>");
      synref = "syn2_HL";
      xmloutput = xmloutput.replace(new RegExp(synref, 'g'), "<span style='background-color:orange';>" + synref + "</span>");

      break;
    }
  }

  var newwindow = window.open("", "View XML", 'height=700,width=1100');
  newwindow.document.body.innerHTML = "<code id='xmlcode'>" + xmloutput; + "</code>";
  if (window.focus) {
    newwindow.focus()
  }
  return false;
}

function connectNodes() {
  var id = -1;
  var nodeToConnect = -1;

  var selected = $(".foundLemma").find(".selected");
  if (selected !== undefined && selected.length !== 0) {
    id = selected[0].id.replace("lem", "");
  }

  selected = $(".foundRefs").find(".selected");
  if (selected !== undefined && selected.length !== 0) {
    id = selected[0].classList[0].replace("sy", "");
  }

  selected = $("svg .nodes .node[selected='selected']");
  if (selected !== undefined && selected.length !== 0 && selected[0].hasOwnProperty("__data__")) {
    nodeToConnect = selected[0].__data__.id;
  }

  if (id !== -1 && nodeToConnect !== -1)
    findSynonyms(id, nodeToConnect);
}


function connectNodesAsync(targetid) {
  var order = -1;
  var sourceid = -1;

  var selected = $(".foundLemma").find(".selected");
  if (selected !== undefined && selected.length !== 0) {
    id = selected[0].id.replace("lem", "");
    sourceid = "hl_" + id;
  }

  selected = $(".foundRefs").find(".selected");
  if (selected !== undefined && selected.length !== 0) {
    order = selected[0].id.replace("sy", "");
    id = selected[0].classList[0].replace("sy", "");
    sourceid = "hl_" + id + "_" + order;
  }

  var sourcenode = nodes.find(o => o.id === sourceid);
  var targetnode = nodes.find(o => o.id === targetid);

  var info = [];
  info.push({
    key: "Type",
    value: "By Search Result"
  });

  var nl = {
    value: 10,
    source: sourceid,
    target: targetid,
    info: info,
    sourceinfo: sourcenode.info,
    targetinfo: targetnode.info
  }
  addToLinks(nl);

  connectEqualNodes();
}

function connectEqualNodes() {

  for (i = 0; i < nodes.length; i++) {
    for (j = 0; j < nodes.length; j++) {
      if (j !== i && nodes[i].label === nodes[j].label) {
        var info = [];
        info.push({
          key: "Type",
          value: "By Equal Name"
        });
        info.push({
          key: "Orig",
          value: ""
        });
        info.push({
          key: "Page",
          value: ""
        });
        var nl = {
          value: 10,
          source: nodes[i].id,
          target: nodes[j].id,
          info: info,
          sourceinfo: nodes[i].info,
          targetinfo: nodes[j].info
        }
        addToLinks(nl);
      }
    }
  }
}

function deleteNodes(nodeToDelete) {
  var deleteCount = 0;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id == nodeToDelete) deleteCount = i;
  }
  nodes.splice(deleteCount, 1);
  var deleteEdges = [];
  for (var i = 0; i < links.length; i++) {
    if (links[i].source.id == nodeToDelete || links[i].target.id == nodeToDelete) deleteEdges.push(i);
  }
  for (var i = deleteEdges.length - 1; i > -1; i--) {
    var loop = deleteEdges.length;
    while (loop--)
      links.splice(deleteEdges[loop], 1);
  }
  restartGraph();
  renderGraph();
}

/************************************
              D3
*************************************/

function renderGraph() {

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", function(d) {
      return 3; // Math.sqrt(d.value);
    })
    .on("mousemove", handleMouseMoveLink)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("click", function(d) {

      if (!isInDeleteMode()) {
        getSearchResults(d);
        $(".nodes .node").removeAttr('selected');
        d3.select(this).attr('selected', 'selected');
      } else {
        deleteNodes(d.id);
      }
    });

  node.append("circle")
    .attr("r", 5)
    .attr("fill", function(d) {
      return color(d.group);
    })
    .on("mousemove", handleMouseMoveNode)
    .on("mouseover", handleMouseOverNode)
    .on("mouseout", handleMouseOut);

  node.append("text")
    .attr("dx", 2)
    .attr("dy", ".35em")
    .attr("fill", "black")
    .text(function(d) {

      if (d.group != 1)
        colorSuggestions(d);

      return d.label
    });

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


function handleMouseMoveLink(d) {
  $("#hoverinfo").css("display", "block");
  $("#hoverinfo").css("overflow", "hidden");
  $("#hoverinfo").css("position", "fixed");
  $("#hoverinfo").css("top", 20 + d3.event.y + "px");
  $("#hoverinfo").css("left", 20 + d3.event.x + "px");

}

function handleMouseOver(d) {
  linkinfo(d.info, d.sourceinfo, d.targetinfo);
}

function handleMouseOut(d) {
  $("#hoverinfo").css("display", "none");
  $("#hoverinfo").css("overflow", "visible");
  $("#hoverinfo").html("No Info");
}

function handleMouseMoveNode(d) {
  $("#hoverinfo").css("display", "block");
  $("#hoverinfo").css("overflow", "hidden");
  $("#hoverinfo").css("position", "fixed");
  $("#hoverinfo").css("top", 20 + d3.event.y + "px");
  $("#hoverinfo").css("left", 20 + d3.event.x + "px");
}

function handleMouseOverNode(d) {

  if (isInDeleteMode() && d3.event.ctrlKey) {
    $("#hoverinfo").html("No Info");
    $("#hoverinfo").css("display", "none");
    $("#hoverinfo").css("overflow", "visible");
    deleteNodes(d.id);
  } else nodeinfo(d.info);
}


/************************************
            Helper Functions
*************************************/

function addToNodes(node) {
  var found = nodes.find(o => o.id === node.id)
  if (found === undefined)
    nodes.push(node);
}

function addToLinks(link) {
  var found = {}
  if (link.source.hasOwnProperty("id"))
    found = links.find(o => (o.source.id == link.source.id && o.target.id == link.target.id) || (o.target.id == link.source.id && o.source.id == link.target.id))
  else found = links.find(o => (o.source.id == link.source && o.target.id == link.target) || (o.target.id == link.source && o.source.id == link.target))
  if (found === undefined)
    links.push(link);
}

function clearGraphData() {
  $("svg").empty();
  nodes.length = 0;
  links.length = 0;
  simulation.alpha(1);
  simulation.restart();
}

function restartGraph() {
  $("svg").empty();
  simulation.alpha(1);
  simulation.restart();
}

function removeGraph() {
  $("svg").empty();
}

$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({
    opacity: 'toggle',
    height: 'toggle'
  }, 'fast', easing, callback);
};

function nodeinfo(arr) {

  var out = "";
  for (i = 0; i < arr.length; i++) {
    out += arr[i].key + ": " + arr[i].value + "<br/>";
  }
  $("#hoverinfo").html(out);
}

function linkinfo(link, source, target) {

  var out = "";

  for (i = 0; i < source.length; i++) {
    out += source[i].value + "-------------" + target[i].value + "<br/>";
  }

  out += "<br/>";

  for (i = 0; i < link.length; i++) {
    out += link[i].key + ": " + link[i].value + "<br/>";
  }
  $("#hoverinfo").html(out);
}

function refineSearchString1(a) {
  return a.replace(" ", "").replace("¿", "").replace("¿|", "");
}

function refineSearchString2(a) {
  return a.replace(/[^\w\s]/gi, '');
}

function addLoader(loc) {
  if (loc === "main") $("#lemma-list .loadercont").addClass("loader");
  if (loc === "lemma") $(".rightcol .loadercont").addClass("loader");
  if (loc === "ref") $(".leftcol .loadercont").addClass("loader");
  if (loc === "graph") $("#main .loadercont").addClass("loader");
}

function removeLoader(loc) {
  if (loc === "main") $("#lemma-list .loadercont").removeClass("loader");
  if (loc === "lemma") $(".rightcol .loadercont").removeClass("loader");
  if (loc === "ref") $(".leftcol .loadercont").removeClass("loader");
  if (loc === "graph") $("#main .loadercont").removeClass("loader");
}

function showError(loc) {}

function switchDeleteMode() {
  var sel = "#deleteNode";
  if (!$(sel).hasClass("selected"))
    $(sel).addClass("selected");
  else $(sel).removeClass("selected");
}

function isInDeleteMode() {
  return $("#deleteNode").hasClass("selected");
}

/************************************
        Load XML
*************************************/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    getXML1(this);
  }
};
xhttp.open("GET", "/SampleData/entries1.xml", true);
xhttp.send();

function getXML1(xml) {

  entryColl = xml.responseXML.children[0].children;
}

/************************************
        Elastic search queries
*************************************/


function bodyAllLemma() {
  return {
    "_source": ["array.array.arr_orth.text", "array.array.array.arr_orth.text", "array.array.arr_orth.volume", "array.array.array.arr_orth.volume"],
    "size": "10000",
    "sort": {
      "volume": "asc",
      "order": "asc"
    },
    "query": {
      "bool": {
        "must": {
          "match_all": {}
        }
      }
    }
  };
}

function bodyAllLemmaWithSynRefs() {
  return {
    "_source": ["array.array.arr_orth.text", "array.array.array.arr_orth.text", "array.array.arr_orth.volume", "array.array.array.arr_orth.volume"],
    "size": "10000",
    "sort": {
      "volume": "asc",
      "order": "asc"
    },
    "query": {
      "query_string": {
        "query": "((array.arr_oRef.arr_oRef.type:syn) OR (array.arr_oRef.type:syn) OR (array.array.arr_oRef.type:syn) OR (array.array.array.arr_oRef.type:syn))"
      }
    }
  };
}



function bodySynonymsOfLemma(entryID) {
  return {
    "_source": "*arr_oRef*",
    "size": "200",
    "sort": {
      "order": "asc"
    },
    "query": {
      "bool": {
        "must": {
          "term": {
            "_id": +entryID + ""
          }
        }
      }
    }
  };
}


function bodyCheckIfLemmaEntry(label) {
  var a = refineSearchString1(label);
  return {
    "size": "1",
    "query": {
      "query_string": {
        "query": "((array.array.arr_orth.text.keyword:" + a + "*) OR (array.array.array.arr_orth.text.keyword:" + a + "*)) AND ((array.arr_oRef.arr_oRef.type:syn) OR (array.arr_oRef.type:syn) OR (array.array.arr_oRef.type:syn) OR (array.array.array.arr_oRef.type:syn))"
      }
    }
  };
}



function bodyLemmaSuggForSyn(label) {
  var a = refineSearchString1(label);
  return {
    "_source": ["array.array.arr_orth.text", "array.array.array.arr_orth.text"],
    "size": "1000",
    "query": {
      "query_string": {
        "query": "((array.array.arr_orth.text.keyword:" + a + "*) OR (array.array.array.arr_orth.text.keyword:" + a + "*)) AND ((array.arr_oRef.arr_oRef.type:syn) OR (array.arr_oRef.type:syn) OR (array.array.arr_oRef.type:syn) OR (array.array.array.arr_oRef.type:syn))"
      }
    }
  };
}
function bodyRefSuggForSyn(label) {
  var b = refineSearchString1(label)
  var a = refineSearchString2(label);

  return {
    "_source": ["array.arr_oRef.text", "array.arr_oRef.arr_oRef.text", "array.array.arr_oRef.text", "array.array.array.arr_oRef.text", "array.arr_oRef.order", "array.arr_oRef.arr_oRef.order", "array.array.arr_oRef.order", "array.array.array.arr_oRef.order", "array.arr_oRef.type", "array.arr_oRef.arr_oRef.type", "array.array.arr_oRef.type", "array.array.array.arr_oRef.type"],
    "size": "1100",
    "query": {
      "bool": { "should": [
        { "term": { "array.arr_oRef.text.keyword": "" + label + "" }},
        { "term": { "array.arr_oRef.arr_oRef.text.keyword": "" + label + ""}},
        { "term": { "array.array.arr_oRef.text.keyword": "" + label + ""}},
        { "term": { "array.array.array.arr_oRef.text.keyword": "" + label + "" }},
        { "term": { "array.arr_oRef.text.keyword": "" + b + ""}},
        { "term": { "array.arr_oRef.arr_oRef.text.keyword": "" + b + ""}},
        { "term": { "array.array.arr_oRef.text.keyword": "" + b + "" }},
        { "term": { "array.array.array.arr_oRef.text.keyword": "" + b + ""  }}
        ]
      }
    }
  };
}

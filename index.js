console.log("hello world");

let width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  ),
  height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

const svg = d3
  .select("body")
  .append("svg")
  .style("cursor", "move");

svg
  .attr("viewBox", "50 10 " + width + " " + height)
  .attr("preserveAspectRatio", "xMinYMin");

// let zoom = d3.zoom().on("zoom", function() {
//   var transform = d3.zoomTransform(this);
//   map.attr("transform", transform);
// });

// svg.call(zoom);

const map = svg.append("g").attr("class", "countries");

const drawMap = (world, data) => {
  const projection = d3
    .geoMercator()
    .scale(130)
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);
  const color = d3
    .scaleThreshold()
    .domain([10, 30, 50, 70, 90, 110])
    .range([
      "#7f0000",
      "#b30000",
      "#d7301f",
      "#ef6548",
      "#fc8d59"
      //   "#fdbb84",
      //   "#fdd49e"
    ]);

  let features = world.features;
  let realCountryNames = features.map(d => d.properties.NAME);
  let lifeEbyCountry = {};
  data.map(le => {
    return (lifeEbyCountry[le.country] = le.expectancy);
  });
  features.map(d => {
    if (!lifeEbyCountry[d.properties.NAME]) {
      console.log(d.properties.NAME);
    }
    // return (d.details = lifeEbyCountry[d.properties.NAME]);
  });
  console.log(features);
  console.log(lifeEbyCountry);

  console.log("-----------");

  map
    .append("g")
    .selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("name", d => d.properties.NAME)
    .attr("id", d => d.id)
    .attr("d", path)
    .style("fill", d => {
      //   if (
      //     // d.properties.type !== "Country" &&
      //     // d.properties.type !== "Sovereign Country"
      //   ) {
      //     return "#000000";
      //   }
      return lifeEbyCountry[d.properties.NAME]
        ? color(lifeEbyCountry[d.properties.NAME])
        : "#ffffff";
    });
  console.log("----------------");

  console.log(map);

  //   const features = topojson.feature(world, world.objects.countries).features;
  //   console.log(features);
};

d3
  .queue()
  .defer(d3.json, "ne_50m_admin_0_countries.json")
  .defer(d3.json, "life-expectancy-by-country.json")
  .await((error, world, data) => {
    if (error) {
      console.log("ooopsies errorrrr", error);
    }
    drawMap(world, data);
  });

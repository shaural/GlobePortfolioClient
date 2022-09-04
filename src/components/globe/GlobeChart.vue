<template>
  <div id="chartdiv" ref="chartdiv"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import worldLow from "@amcharts/amcharts5-geodata/worldLow";
import usaLow from "@amcharts/amcharts5-geodata/usaLow";
import indiaLow from "@amcharts/amcharts5-geodata/indiaLow";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { visitedCountries, visitedStatesIndia, visitedStatesUSA } from "./visitedTemp"

onMounted(() => {
  initGlobeChart();
})

function initGlobeChart() {
  const root = am5.Root.new("chartdiv");
  root.setThemes([
    am5themes_Animated.new(root),
    am5themes_Dark.new(root)
  ]);
  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "rotateY",
      projection: am5map.geoOrthographic(),
      paddingBottom: 20,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
    })
  );
  plotDisabledCountries(root, chart, worldLow, visitedCountries);
  plotCountries(root, chart, worldLow, visitedCountries);
  plotCountries(root, chart, usaLow, visitedStatesUSA);
  plotCountries(root, chart, indiaLow, visitedStatesIndia);
  plotBackground(root, chart);
  chart.appear(1000, 100);
}

function plotDisabledCountries(root: am5.Root, chart: am5map.MapChart, geoData: FeatureCollection<Geometry, GeoJsonProperties>, visited: string[]) {
  const disabledSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: geoData,
      exclude: visited,
      fill: root.interfaceColors.get("disabled"),
    })
  );
}

function plotCountries(root: am5.Root, chart: am5map.MapChart, geoData: FeatureCollection<Geometry, GeoJsonProperties>, visited: string[]) {
  const worldSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: geoData,
      include: visited,
    })
  );
  worldSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    toggleKey: "active",
    interactive: true,
  });
  worldSeries.mapPolygons.template.states.create("hover", {
    fill: root.interfaceColors.get("primaryButtonHover"),
  });

  worldSeries.mapPolygons.template.states.create("active", {
    fill: root.interfaceColors.get("primaryButtonHover"),
  });
  setOnClickEvent(chart, worldSeries);
}

function plotBackground(root: am5.Root, chart: am5map.MapChart) {
  const backgroundSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {})
  );
  backgroundSeries.mapPolygons.template.setAll({
    fill: root.interfaceColors.get("alternativeBackground"),
    fillOpacity: 0.1,
    strokeOpacity: 0,
  });
  backgroundSeries.data.push({
    geometry: am5map.getGeoRectangle(90, 180, -90, -180),
  });
}

function setOnClickEvent(chart: am5map.MapChart, polygonSeries: am5map.MapPolygonSeries) {
  let previousPolygon;
  polygonSeries.mapPolygons.template.on("active", function (active, target) {
    if (previousPolygon && previousPolygon != target) {
      previousPolygon.set("active", false);
    }
    if (target.get("active")) {
      let centroid = target.geoCentroid();
      if (centroid) {
        chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
        chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
      }
    }
    previousPolygon = target;
  });
}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 500px;
  max-width: 100%;
}
</style>

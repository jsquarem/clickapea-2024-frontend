async function fetchSvg(svgPath) {
  const response = await fetch(svgPath);
  let text = await response.text();

  // Modify the SVG to scale correctly and use currentColor for fill and stroke
  text = text.replace(/width="[^"]+"/g, 'width="100%"');
  text = text.replace(/height="[^"]+"/g, 'height="100%"');
  text = text.replace(/<svg /, '<svg preserveAspectRatio="xMinYMin meet" ');
  //   text = text.replace(/fill="[^"]+"/g, 'fill="currentColor"');
  //   text = text.replace(/stroke="[^"]+"/g, 'stroke="currentColor"');
  //   text = text.replace(
  //     /<\/svg>/,
  //     '<style>svg { color: inherit; }</style></svg>'
  //   );

  return text;
}

export { fetchSvg };

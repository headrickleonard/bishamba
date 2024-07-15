import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const ProductDetailsLoader = (props) => {
  const padding = 20;
  const cardWidth = (width / 2) - (padding * 1.5);

  return (
    <ContentLoader
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      width={width}
        backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
      {...props}
      style={{flex:1,paddingHorizontal:12,marginTop:16}}
    >
      {/* Header Section */}
      <Rect x={padding} y={padding} rx="10" ry="10" width={width - (2 * padding)} height="260" />
      {/* <Circle cx={padding + 50} cy="350" r="30" />
      <Rect x={padding + 100} y="320" rx="5" ry="5" width={width - (padding * 2) - 100} height="20" />
      <Rect x={padding + 100} y="350" rx="5" ry="5" width={width - (padding * 2) - 100} height="20" />
      <Rect x={padding} y="380" rx="5" ry="5" width={width - (2 * padding)} height="20" /> */}
      
      {/* Two-Column Layout for Body */}
      <Rect x={padding} y="420" rx="10" ry="10" width={cardWidth} height="150" />
      <Rect x={width - cardWidth - padding} y="420" rx="10" ry="10" width={cardWidth} height="150" />
      <Rect x={padding} y="580" rx="10" ry="10" width={cardWidth} height="150" />
      <Rect x={width - cardWidth - padding} y="580" rx="10" ry="10" width={cardWidth} height="150" />
    </ContentLoader>
  );
};

export default ProductDetailsLoader;

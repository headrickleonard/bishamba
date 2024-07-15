import React from 'react';
import ContentLoader, { Rect,Circle  } from 'react-content-loader/native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const padding = 20;
const contentWidth = width - 2 * padding;
const columnWidth = (contentWidth - padding) / 2;
const HeaderLoader = (props) => (
    <ContentLoader
    viewBox={`0 0 ${width} 800`}
    height={800}
    width={width}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    {...props}
  >
    {/* Header Section */}
    <Rect x={padding} y="20" rx="10" ry="10" width={contentWidth} height="300" />
    <Circle cx={padding + 50} cy="350" r="30" />
    <Rect x={padding + 100} y="320" rx="5" ry="5" width={contentWidth - 150} height="20" />
    <Rect x={padding + 100} y="350" rx="5" ry="5" width={contentWidth - 150} height="20" />
    <Rect x={padding} y="380" rx="5" ry="5" width={contentWidth} height="20" />
    
    {/* Two-Column Layout for Body */}
    <Rect x={padding} y="420" rx="10" ry="10" width={columnWidth} height="150" />
    <Rect x={padding + columnWidth + padding} y="420" rx="10" ry="10" width={columnWidth} height="150" />
    <Rect x={padding} y="580" rx="10" ry="10" width={columnWidth} height="150" />
    <Rect x={padding + columnWidth + padding} y="580" rx="10" ry="10" width={columnWidth} height="150" />
  </ContentLoader>
);



export default HeaderLoader;

import React from 'react';
import {Image} from 'react-native';
import IconSpec from '../../interfaces/iconSpec.interface';

const Icon = ({source, height, width, tint, styling}: IconSpec) => {
  return (
    <Image
      style={[{height: height, width: width}, styling]}
      height={height}
      width={width}
      source={source}
      tintColor={tint}
    />
  );
};

export default Icon;

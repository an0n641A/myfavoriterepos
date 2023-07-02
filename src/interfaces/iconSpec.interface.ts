import {ImageSourcePropType} from 'react-native';

export default interface IconSpec {
  source: ImageSourcePropType;
  width: number;
  height: number;
  styling?: object;
  tint?: string;
}

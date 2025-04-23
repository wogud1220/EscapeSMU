import React from 'react';
import { Text as RNText, TextProps} from 'react-native';

interface CustomTextProps extends TextProps {}

const CustomText: React.FC<CustomTextProps> = ({ style, ...rest}) => {
    const customStyle = {
        fontFamily: 'SDMISaeng.ttf',
        color: '#000000'
    };

    return <RNText style={[customStyle, style]} {...rest} />;
};

export default CustomText;




// <Text></Text>를 <CustomText></CustomText>로 변경하여 사용하세요.
// 아직 안 바꿈

//https://mactto.tistory.com/entry/React-Native-%EC%BB%A4%EC%8A%A4%ED%85%80-%ED%8F%B0%ED%8A%B8%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B3%A0-%EC%A0%84%EC%97%AD%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95
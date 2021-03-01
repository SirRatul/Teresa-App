import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Animated, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { RFPercentage } from "react-native-responsive-fontsize";

const defaultStyles = {
  labelStyle: {
    position: 'absolute',
    width: '100%',
    color: Colors.kashmirBlue
  }
}

const FloatingLabelVerificationCodeInput = (props) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFirstRun = useRef(true)
  const animatedIsFocused = useState(new Animated.Value(props.value === '' ? 0 : 1))[0]

  const totalWidth = (Dimensions.get('window').width - RFPercentage(3)) * 0.37

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }
 
  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || props.value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [props.value, isFocused])

  useEffect (() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    props.inputValidation(props.value)
  }, [props.value, isFocused])

  const labelStyle = {
    ...defaultStyles.labelStyle
  }

  const animatedLabelStyle = {
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -30]
    }),
    left: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [totalWidth / 2, 0]
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.danube, Colors.kashmirBlue]
    })
  }

  return <>
    <Animated.Text style={[labelStyle,animatedLabelStyle]}>
      {props.label}
    </Animated.Text>
    <TextInput
      {...props}
      style={[props.style]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      blurOnSubmit
      underlineColorAndroid="transparent"
    />
  </>
}

export default FloatingLabelVerificationCodeInput

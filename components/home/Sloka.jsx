import { View, Text, Animated,Easing  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { fetchSloka } from '../../constants/api/apiHome'

export default function Sloka() {
    const [sloka,setSloka] = useState('');
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [textWidth, setTextWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

useEffect(()=>{
    getSloka();
    // startAnimation();
})
useEffect(() => {
    if (textWidth > 0 && containerWidth > 0) {
        startAnimation();
    }
}, [textWidth, containerWidth]);
    // get sloka
    const  getSloka = async () => {
        try {
            const response = await fetchSloka()
            console.log(response);
            if(response.status === 200){
                setSloka(response.data?.sloka)
            }
        } catch (error) {
            console.log(error);
        }
    }

     // Start the marquee animation
     const startAnimation = () => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: -(textWidth), // Move the text outside to the left
                duration: 5000, // Adjust the speed here (10 seconds in this case)
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

  return (
     <View
            style={{ marginHorizontal: 20, marginTop: 15, overflow: 'hidden' }}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // Get the width of the container
        >
            {/* <Animated.Text
                style={{
                    transform: [{ translateX: animatedValue }],
                    writingDirection: 'rtl', // Right to Left
                    fontSize: 18,
                    lineHeight: 30,
                }}
                onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)} // Get the width of the text
            > */}
            <Text style={{fontSize:18,textAlign:"center"}}>
                {sloka}
            </Text>
            {/* </Animated.Text> */}
        </View>
  )
}
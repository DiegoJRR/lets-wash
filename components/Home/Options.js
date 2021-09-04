import React from 'react';
import { View } from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';

const Options = (props) => {
    const theme = useTheme();
    const { style } = props;
    
    return (
        <View style={[style]}>
            <View
                style={{
                    backgroundColor: theme['background-basic-color-1'],
                    borderRadius: 30,
                    shadowColor: 'rgba(0,0,0,1)',
                    shadowOffset: {
                        height: 1,
                        width: 1,
                    },
                    elevation: 30,
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Icon
                    name="menu"
                    style={{
                        width: 32,
                        height: 32,
                    }}
                    fill={theme['text-basic-color']}
                />
            </View>
        </View>
    );
};

export default Options;

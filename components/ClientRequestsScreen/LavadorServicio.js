import React from 'react';
import { View } from 'react-native';
import { Button, Text, Icon, Avatar } from '@ui-kitten/components';

function LavadorServicio(props) {
    return (
        <View
            style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
        >
            <Avatar
                source={
                    props.uri
                        ? { uri: props.uri }
                        : require('../../assets/placeholder.jpg')
                }
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                }}
            >
                <Text
                    style={{
                        fontWeight: 'bold',
                        textAlignVertical: 'center',
                        flex: 1,
                    }}
                    numberOfLines={1}
                >
                    {props.name || 'Lavador'}
                </Text>
                {props.showButtons ? (
                    <View style={{alignSelf: "flex-end", flexDirection: "row"}}>
                        <Button
                            onPress={props.onCancel}
                            appearance="ghost"
                            status="danger"
                            accessoryLeft={(props) => (
                                <Icon
                                    name="close-outline"
                                    style={{
                                        width: 32,
                                        height: 32,
                                    }}
                                    fill={props.style.tintColor}
                                />
                            )}
                        ></Button>
                        <Button
                            onPress={props.onChat}
                            appearance="ghost"
                            accessoryLeft={(props) => (
                                <Icon
                                    name="message-square-outline"
                                    style={{
                                        width: 32,
                                        height: 32,
                                    }}
                                    fill="#8F9BB3"
                                />
                            )}
                        ></Button>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

export default LavadorServicio;

import React, { useState } from 'react';
import { Layout, Input, Icon, useTheme } from '@ui-kitten/components';
import { Pressable } from 'react-native';

const PlaneIcon = (props) => <Icon {...props} name="paper-plane" />;

const MessageInput = (props) => {
    const [message, setMessage] = useState('');
    const theme = useTheme();

    return (
        <Layout
            style={{
                flexDirection: 'row',
                paddingVertical: 8,
                paddingHorizontal: 10,
                alignItems: 'center',
            }}
        >
            <Input
                style={{
                    flex: 1,
                    flexGrow: 1,
                    alignSelf: 'center',
                }}
                size="medium"
                value={message}
                placeholder="Escribe un mensaje"
                onChangeText={(value) => {
                    props.onChange(value);
                    setMessage(value);
                }}
            />
            <Pressable style={{ paddingHorizontal: 8 }}>
                <Icon
                    fill={theme['text-primary-color']}
                    style={{ width: 30, height: 30 }}
                    name="paper-plane"
                />
            </Pressable>
        </Layout>
    );
};

export default MessageInput;

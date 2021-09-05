import React, { useState } from 'react';
import { Input, Icon } from '@ui-kitten/components';
import { TouchableWithoutFeedback } from 'react-native';

const FormGroup = (props) => {
    const { fields, missingFields, onChange, disabled } = props;
    const [values, setValues] = useState(
        fields.map((field) => field.defaultValue ?? '')
    );
    const [secureTextEntry, setSecureTextEntry] = useState(
        fields.map((field) => field.secretField)
    );
    
    return (
        <>
            {fields.map((field, idx) => (
                <Input
                    key={idx}
                    disabled={disabled ?? false}
                    status={missingFields.has(field.name) ? 'danger' : 'basic'}
                    style={{ marginVertical: 5 }}
                    placeholder={field.placeholder}
                    caption={
                        missingFields.has(field.name)
                            ? field.missingMessage ??
                              'Este campo no puede estar vacío'
                            : field.defaultCaption ?? ''
                    }
                    value={values[idx]}
                    onChangeText={(nextValue) => {
                        onChange(field.name, nextValue);
                        const newValues = [...values];
                        newValues[idx] = nextValue;
                        setValues(newValues);
                    }}
                    captionIcon={
                        field.captionIcon && field.defaultCaption
                            ? (props) => (
                                  <Icon {...props} name={field.captionIcon} />
                              )
                            : null
                    }
                    accessoryRight={
                        field.secretField
                            ? (props) => (
                                      <TouchableWithoutFeedback
                                          onPress={() => {
                                              const entries = [
                                                  ...secureTextEntry,
                                              ];
                                              entries[idx] = !entries[idx];
                                              setSecureTextEntry(entries);
                                          }}
                                      >
                                          <Icon
                                              {...props}
                                              name={
                                                  secureTextEntry[idx]
                                                      ? 'eye-off'
                                                      : 'eye'
                                              }
                                          />
                                      </TouchableWithoutFeedback>
                                  )
                            : null
                    }
                    // accessoryLeft={field.accessoryLeft ?? null}
                    secureTextEntry={secureTextEntry[idx]}
                />
            ))}
        </>
    );
};

export default FormGroup;

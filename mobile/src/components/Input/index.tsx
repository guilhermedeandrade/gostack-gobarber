import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  forwardRef,
} from 'react'
import { TextInputProps } from 'react-native'

import { useField } from '@unform/core'
import { Container, TextInput, Icon } from './styles'

interface InputProps extends TextInputProps {
  name: string
  icon: string
  containerStyle?: {}
}

interface InputValueReference {
  value: string
}

interface InputRef {
  focus(): void
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref,
) => {
  const { registerField, defaultValue = '', fieldName, error } = useField(name)

  const inputValueRef = useRef<InputValueReference>({ value: defaultValue })
  const inputElementRef = useRef<any>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)

    setIsFilled(Boolean(inputValueRef.current?.value))
  }, [])

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus()
    },
  }))

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(_ref: any, value) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({ text: value })
      },
      clearValue() {
        inputValueRef.current.value = ''
        inputElementRef.current.clear()
      },
    })
  }, [fieldName, registerField])

  return (
    <Container
      style={containerStyle}
      isFocused={isFocused}
      isErrored={Boolean(error)}
    >
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        defaultValue={defaultValue}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onChangeText={value => {
          inputValueRef.current.value = value
        }}
        {...rest}
      />
    </Container>
  )
}

export default forwardRef(Input)

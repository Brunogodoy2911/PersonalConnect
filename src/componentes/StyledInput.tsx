import React, { useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

import Box from "./Box";
import Input from "./Input";
import StyledText from "./StyledText";

interface IStyledInputProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  value?: string;
  onChangeText?: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  maxLength?: number;
  style?: StyleProp<TextStyle>;
  rules?: object;
  secureTextEntry?: boolean;
}

const StyledInput = <T extends FieldValues>({
  label,
  name,
  control,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  style,
  rules,
  secureTextEntry = false,
}: IStyledInputProps<T>) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Box position="relative">
      <StyledText
        variant="title"
        color={isFocused ? "greyFocus" : "grey"}
        marginBottom="s"
      >
        {label}
      </StyledText>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Input
              variant="title"
              height={40}
              width={300}
              backgroundColor="white"
              marginBottom="m"
              paddingLeft="m"
              color="black"
              borderWidth={1}
              borderColor={isFocused ? "black" : "grey"}
              borderRadius={5}
              placeholder={placeholder}
              placeholderTextColor="grey"
              value={field.value || value}
              onChangeText={field.onChange || onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              keyboardType={keyboardType}
              maxLength={maxLength}
              style={style}
              secureTextEntry={secureTextEntry}
            />
            {fieldState?.error?.message && (
              <StyledText variant="errorText">
                {fieldState?.error?.message}
              </StyledText>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default StyledInput;

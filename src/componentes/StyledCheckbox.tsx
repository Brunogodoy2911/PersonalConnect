import React from "react";
import { StyleSheet } from "react-native";
import { Checkbox } from "expo-checkbox";
import Box from "./Box";
import StyledText from "./StyledText";
import { Controller, FieldValues, Control, Path } from "react-hook-form";

interface ICustomCheckboxProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  value: boolean;
  onChange: (value: boolean) => void;
  colorBox: string;
  color: string;
  rules?: object;
}

const StyledCheckbox = <T extends FieldValues>({
  label,
  name,
  control,
  value,
  onChange,
  colorBox,
  color,
  rules,
}: ICustomCheckboxProps<T>) => {
  return (
    <Box style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ fieldState }) => (
          <>
            <Checkbox
              style={styles.checkbox}
              value={value}
              onValueChange={onChange}
              color={colorBox}
            />
            <StyledText style={[styles.label, { color }]}>{label}</StyledText>
          </>
        )}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    borderRadius: 10,
    backgroundColor: "white",
    bottom: 2,
  },
  label: {
    color: "black",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
});

export default StyledCheckbox;

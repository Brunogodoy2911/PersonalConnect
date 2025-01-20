import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MotiView } from "moti";
import StyledText from "./StyledText";
import Box from "./Box";

interface DropDownProps {
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
  placeholder: string;
  label?: string;
  value: string;
  error?: string; // Novo prop para erro
}

const DropDown: React.FC<DropDownProps> = ({
  data,
  onSelect,
  placeholder,
  label,
  value,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const toggleDropDown = () => setIsOpen((prev) => !prev);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      {label && (
        <StyledText
          variant="title"
          color={isFocused ? "greyFocus" : "grey"}
          marginBottom="s"
        >
          {label}
        </StyledText>
      )}
      <TouchableOpacity
        onPress={toggleDropDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.button, error && { borderColor: "red" }]}
      >
        <Text style={styles.buttonText}>
          {value
            ? data.find((item) => item.value === value)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={styles.dropdown}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                onSelect(item.value);
                setIsOpen(false);
              }}
              style={styles.option}
            >
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </MotiView>
      )}

      {error && (
        <Box marginTop="s">
          <StyledText variant="errorText">{error}</StyledText>
        </Box>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DropDown;

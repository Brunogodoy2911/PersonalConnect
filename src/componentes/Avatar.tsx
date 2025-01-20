import React from "react";
import { Image, ImageRequireSource, ImageURISource, StyleSheet } from "react-native";
import Box from "./Box";
import { Skeleton } from "moti/skeleton";

interface IAvatarProps {
  src: ImageRequireSource | ImageURISource;
  size?: number;
  loading?: boolean;
  children?: React.ReactNode;
}

const Avatar: React.FC<IAvatarProps> = ({
  src,
  size = 32,
  loading = false,
  children,
}) => {
  return (
    <Box>
      {loading ? (
        <Skeleton
          width={size}
          height={size}
          radius={size / 2}
          colorMode="light"
        />
      ) : (
        <Image
          source={src}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      )}
      {children && <Box style={[styles.childrenContainer]}>{children}</Box>}
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
  },
  childrenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Avatar;

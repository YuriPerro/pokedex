import React, { useState } from "react";
import { Platform, View, KeyboardAvoidingView, TextInput, StyleSheet } from "react-native";
import { TouchableOpacity } from "../common/utils";
import { Theme } from "../styles/colors";
import { Fonts } from "../styles/fonts";
import { AntDesign } from "@expo/vector-icons";
import { getBottomSpace } from "react-native-iphone-x-helper";

type Props = {
  onChangeText: ((text: string) => void) | undefined;
  onClickClose: () => void;
};

const Search = ({ onChangeText, onClickClose }: Props) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  const onHandleClose = () => {
    setSearchIsOpen(false);
    setInputIsFocused(false);
    onClickClose();
  };

  return (
    <>
      {Platform.OS === "ios" && (
        <KeyboardAvoidingView behavior={"padding"}>
          <View
            style={[
              styles.containerSearch,
              {
                width: searchIsOpen ? "95%" : 60,
                position: inputIsFocused ? undefined : "absolute",
              },
            ]}
          >
            <View
              style={{
                width: searchIsOpen ? "95%" : 60,
                alignItems: "center",
              }}
            >
              {searchIsOpen ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <TextInput
                    placeholder="Pesquisar Pokemon"
                    onFocus={() => setInputIsFocused(true)}
                    onBlur={() => setInputIsFocused(false)}
                    onChangeText={onChangeText}
                    style={styles.input}
                  />
                  <TouchableOpacity style={{ right: 5 }} onPress={onHandleClose}>
                    <AntDesign name="close" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setSearchIsOpen(true)}>
                  <AntDesign name="search1" size={24} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {Platform.OS === "android" && (
        <View
          style={[
            styles.containerSearch,
            {
              width: searchIsOpen ? "95%" : 60,
              position: searchIsOpen ? undefined : "absolute",
            },
          ]}
        >
          <View
            style={{
              width: searchIsOpen ? "95%" : 60,
              alignItems: "center",
            }}
          >
            {searchIsOpen ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                <TextInput
                  placeholder="Pesquisar Pokemon"
                  onFocus={() => setInputIsFocused(true)}
                  onBlur={() => setInputIsFocused(false)}
                  onChangeText={onChangeText}
                  style={styles.input}
                />
                <TouchableOpacity style={{ right: 5 }} onPress={onHandleClose}>
                  <AntDesign name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setSearchIsOpen(true)}>
                <AntDesign name="search1" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerSearch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.BACKGROUND,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.9,
    elevation: 2,
    bottom: Platform.OS === "ios" ? getBottomSpace() : 25,
    right: 10,
    alignSelf: "flex-end",
  },
  input: {
    fontFamily: Fonts.Pop500,
    color: "#0d0d0d",
    fontSize: 16,
    paddingLeft: 10,
    borderRadius: 25,
    marginRight: 15,
    height: 60,
    width: "80%",
  },
});

export default Search;

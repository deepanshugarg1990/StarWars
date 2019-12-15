import React from 'react';
import { View } from 'react-native';
import { CardItem, Text } from "native-base";
import {PersonDetailsCardItem, FilmDetailsCardItem, PlanetDetailsCardItem} from './index';

const detailsCardItem = props => {
    let cardItemBodyContent = null;
    if (props.cardItemContentType === 'planet') {
        cardItemBodyContent = (
            <View>
                <PlanetDetailsCardItem data={props.cardItemContent} />
            </View>
        );
    } else if (props.cardItemContentType === 'person') {
        cardItemBodyContent = (
            props.cardItemContent.map((item, index) => {
                return (<PersonDetailsCardItem key={index} data={item} />);
            })
        );
    } else if (props.cardItemContentType === 'film') {
        cardItemBodyContent = (
            props.cardItemContent.map((item, index) => {
                return (<FilmDetailsCardItem key={index} data={item} />);
            })
        );
    }

    return (
        <View>
            <CardItem header bordered>
                <Text>{props.cardItemHeaderText}</Text>
            </CardItem>
            {cardItemBodyContent}
        </View>
    );
};

export default detailsCardItem;

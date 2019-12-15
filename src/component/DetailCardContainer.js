import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Card, Content} from "native-base";
import DetailsCardItem from "../screens/DetailsCardItem";

export default class DetailCardContainer extends Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: params.item.name
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {
                planet: this.props.navigation.state.params.item,
                residents: [],
                films: []
            }
        }
    }

    componentDidMount() {
        this.fetchRelevantData();
    }

    fetchRelevantData = () => {
        const promiseArray = [];
        const residents = this.state.data.planet.residents;
        const films = this.state.data.planet.films;
        const urls = residents.concat(films);

        urls.map(url => {
            promiseArray.push(this.fetchData(url));
        });

        Promise.all(promiseArray).then((data) => {
            this.updateDataState(data);
            this.toggleIsLoadingState();
        }).catch(error => console.log('Error:', error));
    }

    fetchData = (url) => {
        return fetch(url).then(response => {
            return response.json();
        }).then(responseJson => {
            return responseJson
        }).catch(error => console.log('Error fetching data:', error));
    }

    toggleIsLoadingState = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                isLoading: !previousState.isLoading
            }
        });
    }

    updateDataState = (data) => {
        const residents = data.filter((item) => {
            return item.url.includes('people');
        });
        const films = data.filter((item) => {
            return item.url.includes('films');
        });

        this.setState(previousState => {
            return {
                data: {
                    ...previousState.data,
                    residents: residents,
                    films: films
                }
            }
        });
    }

    render() {
        let content = null;

        if (this.state.isLoading) {
            content = (
                <ActivityIndicator
                    style={styles.activityIndicatorStyle}
                    color='yellow'
                    size="large"
                />
            );
        } else {
            content = (
                <Card>
                    <DetailsCardItem
                        cardItemContentType='planet'
                        cardItemHeaderText='Planet Details'
                        cardItemContent={this.state.data.planet}
                    />
                    <DetailsCardItem
                        cardItemContentType='person'
                        cardItemHeaderText={`Residents(${this.state.data.residents.length})`}
                        cardItemContent={this.state.data.residents}
                    />
                    <DetailsCardItem
                        cardItemContentType='film'
                        cardItemHeaderText={`Films(${this.state.data.films.length})`}
                        cardItemContent={this.state.data.films}
                    />
                </Card>
            );
        }

        return (

            <Content padder contentContainerStyle={this.state.isLoading ? styles.content : {}}>
                {content}
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 90
    },
    activityIndicatorStyle: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 2
    }
});

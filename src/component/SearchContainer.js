import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Keyboard, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Body, Card, CardItem, Header, Icon, Input, Item, Text} from 'native-base';
import alert from '../utils/alert';
import * as Utility from "../utils/Utility";
import * as Strings from "../utils/String";

export default class SearchContainer extends Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: Strings.SEARCH_SCREEN,
            headerRight: <Icon name="log-out" style={{fontSize: 25, color: "black", marginRight: 10}} size={25}
                               onPress={() => params.logout()}/>
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            search: {
                disableSrearchBar: false,
                searchesPerMinute: 0
            },
            data: {
                nextUrl: '',
                planets: []
            },
            minPopulation: 0,
            maxPopulation: 0
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({logout: this.logout});
        this.interval = setInterval(() => {
            const srearchBarWasDisabled = this.state.search.disableSrearchBar;
            this.updateDisableSrearchBarState(true, () => {
                if (srearchBarWasDisabled) {
                    const title = 'Search has been enabled :-)';
                    const message = 'You can make 15 consecutive searches in a minute.';
                    alert(title, message);
                }
            });
        }, 60000); // 1 minute
    }


    searchInputOnChangeTextHandler = (searchStr) => {
        if (searchStr !== '') {
            let url = `https://swapi.co/api/planets/?search=${searchStr}`;
            this.toggleIsLoadingState();
            this.fetchData(url).then((data) => {
                this.updateDataState(data, true);
                this.toggleIsLoadingState();
            }).catch((error) => {
                console.log('Error:', error)
                this.toggleIsLoadingState();
            });
        } else {
            this.updateDataState({next: '', results: []}, true);
        }
    }

    flatListOnEndReachedHandler = () => {
        if (this.state.data.nextUrl !== '') {
            this.fetchData(this.state.data.nextUrl).then((data) => {
                this.updateDataState(data, false);
            }).catch(error => console.log('Error:', error));
        }
    }

    cardItemOnPressHandler = (item) => {
        this.props.navigator.push({
            screen: 'star-wars.DetailsScreen',
            title: item.name,
            passProps: {
                item
            }
        });
    }

    fetchData = (url) => {
        return fetch(url).then(response => {
            return response.json();
        }).then(responseJson => {
            console.log('Response: ', responseJson);
            return responseJson
        }).catch(error => console.log('Error fetching data:', error));
    }

    toggleIsLoadingState = () => {
        this.setState(previousState => {
            return {
                isLoading: !previousState.isLoading
            }
        });
    }

    updateDisableSrearchBarState = (overwrite, callback) => {
        this.setState(previousState => {
            return {
                search: {
                    disableSrearchBar: overwrite === false && previousState.search.searchesPerMinute + 1 === 15 ? true : false,
                    searchesPerMinute: overwrite === false ? previousState.search.searchesPerMinute + 1 : 0
                }
            }
        }, () => callback());
    }

    updateDataState = (data, overwrite) => {
        this.setState(previousState => {
            const nextUrl = data.next;
            const planets = this.getFilteredPlanetsArray(previousState.data.planets, data.results, overwrite);
            const planetPopulations = this.getPopulationNumbersArray(planets);
            return {
                data: {
                    nextUrl: nextUrl ? nextUrl : '',
                    planets: planets
                },
                minPopulation: planetPopulations.length != 0 ? Math.min(...planetPopulations) : 0,
                maxPopulation: planetPopulations.length != 0 ? Math.max(...planetPopulations) : 0
            }
        });
    }

    getFilteredPlanetsArray = (previousStatePlanetsData, planetsData, overwrite) => {
        let planets = planetsData;
        if (overwrite === false) {
            const allPlanets = previousStatePlanetsData.concat(planetsData);
            const planetNames = allPlanets.map(planet => planet.name);
            planets = allPlanets.filter((planet, index) => {
                return planetNames.indexOf(planet.name) === index;
            });
        }
        return planets;
    }

    getPopulationNumbersArray = (planets) => {
        return planets.map(planet => planet.population)
            .filter((stringPopulation) => stringPopulation !== 'unknown')
            .map((stringPopulation) => parseInt(stringPopulation));
    };

    getTextFontSize = (population) => {
        const minFontSize = 16;
        const maxFontSize = 40;
        let textFontSize = minFontSize;
        if (typeof population !== 'unknown') {
            const numerator = (parseInt(population) - this.state.minPopulation) * (maxFontSize - minFontSize);
            const denominator = this.state.maxPopulation - this.state.minPopulation;
            textFontSize = Math.round(minFontSize + numerator / denominator);
        }
        return isNaN(textFontSize) ? minFontSize : textFontSize;
    };

    logout = () => {
        Utility.setAsyncStorage(Strings.IS_LOGIN, "");
        this.props.navigation.replace('loginScreen');
    }

    render() {
        console.log('State:', this.state);
        let content = null;

        if (this.state.isLoading) {
            content = (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator/>
                </View>
            );
        } else {
            content = (
                <FlatList
                    data={this.state.data.planets}
                    keyExtractor={item => item.name}
                    renderItem={({item}) => (
                        <Card>
                            <CardItem button onPress={() => this.cardItemOnPressHandler(item)}>
                                <Body>
                                <Text style={{fontSize: this.getTextFontSize(item.population)}}>
                                    {item.name}
                                </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    )}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.flatListOnEndReachedHandler}
                />
            );
        }

        return (
            <View>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search"/>
                        <Input
                            placeholder="Search" onChangeText={this.searchInputOnChangeTextHandler}
                            autoCapitalize='none'
                            autoCorrect={false}
                            disabled={this.state.search.disableSrearchBar}
                        />
                    </Item>
                </Header>
                <View style={this.state.isLoading ? styles.content : styles.flatListContainer}>
                    {content}
                </View>
            </View>
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
}


const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    flatListContainer: {
        padding: 20
    },
    activityIndicatorContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    }
});
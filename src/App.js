import React from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis,
   VictoryGroup, VictoryTheme, VictoryLegend,
 VictoryLabel, VictoryPie } from 'victory';
import Button from 'muicss/lib/react/button';
import Loader from 'react-loader'

const dailyTop = "http://www.mocky.io/v2/5d9d15ac31000016c92fc92b" // https://pastebin.com/yAV3gQtb
const weeklyTop = "http://www.mocky.io/v2/5d9d1d7c3100002f262fc944" // https://pastebin.com/jDRwPMZV
const monthlyTop = "http://www.mocky.io/v2/5d9d1ee031000038c92fc947" // https://pastebin.com/fNfJkTAG
const allTimeTop = "http://www.mocky.io/v2/5d9d167b31000038c92fc92c" // https://pastebin.com/tENKBZGF

class Row extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
      score: 0,
      views: 0
    }
  }
  render() {
    return (
      <tr>
        <td>{this.props.index}</td>
        <td><a href={this.props.link} target="_blank" rel="noopener noreferrer">{this.props.title}</a></td>
        <td>{this.props.score}</td>
        <td>{this.props.views}</td>
      </tr>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = { source: dailyTop, datasource: [], charttype: "info", loaded: false }
  }

  loadInfo() {
    var th = this;
    this.serverRequest =
    axios.get(this.state.source)
    .then(function(result) {
      th.setState({
        datasource: result.data,
        loaded: true
      });
    })
  }

  componentDidMount() {
   this.loadInfo();

  }


 componentWillUnmount() {
  this.serverRequest.abort();
  }

  changeToDaily = () => {
    this.setState({source : dailyTop}, () => this.loadInfo() )
  };

  changeToWeekly = () => {
    this.setState({source : weeklyTop}, () => this.loadInfo() )
  };

  changeToMonthly = () => {
    this.setState({source : monthlyTop}, () => this.loadInfo() )
  };

  changeToAllTime = () => {
    this.setState({source : allTimeTop}, () => this.loadInfo() )
  };

  changeToBar = () => {
    this.setState({charttype: "barChart"})
  }

  changeToPie = () => {
    this.setState({charttype: "pieChart"})
  }

  changeToStack = () => {
    this.setState({charttype: "stackChart"})
  }

  changeToInfo = () => {
    this.setState({charttype: "info"})
  }

  eachRow(key, index) {
    return (
      <Row
        index={index + 1}
        link={key.canonical}
        title={key.title}
        score={key.score}
        views={key.visits}
      />
    );
  }

  render() {
    var arr = []
    var count = {}
    let myArr = []
    let chart;

    this.state.datasource.forEach(function(x) {
      arr.push(x.category_name)
   })

   arr.forEach(function(i) {
     count[i] = (count[i]||0)+1;
   });


   for(let key in count){myArr.push({"Category" : key, "Num" : count[key]})}


       if (this.state.charttype === "barChart") {
         chart = (<Chart data={this.state.datasource.slice(0,3)}/>)
       } else if (this.state.charttype === "pieChart") {
         chart = (<PieChart data={myArr}/>)
       } else if (this.state.charttype === "info") {
         chart = (<Info  data={this.state.datasource}/>)
       }

  //  console.log(count)
  //  console.log(this.state.datasource.length)

  if (this.state.datasource.length !== 0) {
    // console.log("The data is there and it's okay")
    return (
      <Loader loaded={this.state.loaded}>
      <div>
        <h1 style={{fill: "rgb(69, 90, 100)", fontWeight: 100}}> Taringa Stats!</h1>
        <div className="mui--text-center">
          <Button onClick={this.changeToDaily}>   Diario    </Button>
          <Button onClick={this.changeToWeekly}>  Semanal   </Button>
          <Button onClick={this.changeToMonthly}> Mensual  </Button>
          <Button onClick={this.changeToAllTime}> Todos </Button>
        </div>

        <table>
          <tbody>
          <tr>
          <th>#</th>
          <th>Titulo</th>
          <th>Puntos</th>
          <th>Visitas</th>
          </tr>
          {this.state.datasource.slice(0,5).map(this.eachRow)}
        </tbody>
        </table>
        <div className="mui--text-center">
        <Button onClick={this.changeToBar} > <i className="fa fa-bar-chart">   </i> </Button>
        <Button onClick={this.changeToPie} > <i className="fa fa-pie-chart">   </i> </Button>
        <Button onClick={this.changeToInfo}> <i className="fa fa-file-text-o"> </i> </Button>
        </div>
        {chart}
        </div>
      </Loader>
    )
  } else {
    // console.log("Seems like there's not data provided by the T! API.")
    return (
      <Loader loaded={this.state.loaded}>
      <div>
        <h1 style={{fill: "rgb(69, 90, 100)", fontWeight: 100}}> Taringa Stats!</h1>
        <div className="mui--text-center">
          <Button onClick={this.changeToDaily}>   Diario    </Button>
          <Button onClick={this.changeToWeekly}>  Semanal   </Button>
          <Button onClick={this.changeToMonthly}> Mensual  </Button>
          <Button onClick={this.changeToAllTime}> Todos </Button>
          <h3>Parece que no hay información proporcionada por la API de Taringa! Puedes tratar con otros periodos de tiempo.</h3>
          <p>Normalmente esto ocurre cuando el día/semana/mes se acaban y no hay suficiente información aun, puede tardar unas horas en refrescarse.</p>
        </div>


        </div>
      </Loader>
    )
  }


  }
}

class Info extends React.Component {
  render () {
    var arrComments = []
    var arrScores = []
    var arrFollows = []

    this.props.data.forEach(function(x) {
          arrComments.push(x.comments)
          arrScores.push(x.score)
          arrFollows.push(x.favorites)
       })

    return (
      <div style={{paddingTop: "20px", margin: "auto", maxWidth: "600px", height: "500px", fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 16, textAlign: "center"}}>
        <p>Esta simple aplicación web fue creada para <a href="https://www.taringa.net/" target="_blank" rel="noopener noreferrer">T!</a></p>
        <p>Su funcionalidad la de visualizar y organizar algunos de los datos de los Top Posts. Cambia el periodo de tiempo y los datos también cambiaran!</p>
        <p>Puedes ver una visualización de los Puntos VS Visitas de los tres primeros Top Posts de cada periodo de tiempo, también puedes ver cual es la distribución de categorías entre los diez primeros Top Posts de cada periodo de tiempo.</p>
        <p>Algunos datos interesantes son:</p>
        <p>El promedio de puntos recibidos en Top Posts es  de: {Math.round(arrScores.reduce((x,y) => x+y,0)/arrScores.length)}</p>
        <p>El promedio de seguidores en los Top Posts es de: {Math.round(arrFollows.reduce((x,y) => x+y,0)/arrFollows.length)}</p>
        <p>El promedio de comentarios en los Top Posts es de de: {Math.round(arrComments.reduce((x,y) => x+y,0)/arrComments.length)}</p>
        <p>Todos los datos son sacados de la <a href="http://api.taringa.net/docs/taringa/home.html" target="_blank" rel="noopener noreferrer">API Oficial de Taringa.</a></p>
        <p>Creado por <a href="https://www.taringa.net/hugo1583/posts" target="_blank" rel="noopener noreferrer">@hugo1583</a>.</p>
      </div>

    )
  }
}

class Chart extends React.Component {
  render() {

    return (
      <VictoryChart
        containerComponent={<svg  viewBox="-50 0 450 450"></svg>}
        style={
        {parent:
          {height: "600"}
        }}
        domainPadding={{ x: 25 }}
        theme={VictoryTheme.material}
      >

      <VictoryAxis
        style={{
          tickLabels: {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
          fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 16}
        }}
        tickValues={[1, 2, 3]}
        tickFormat={["1", "2", "3"]}
      />
      <VictoryAxis
        style={{
          tickLabels: {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
          fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 16}
        }}
        dependentAxis
        tickFormat={(x) => (`${x / 1000}k`)}
      />

      <VictoryGroup
        offset={15}
        style={{ data: { width: 15 } }}
        colorScale={
          ["#000000", "#EBEBEB"]}
      >
      <VictoryBar
        animate={{ onLoad: { duration: 1000 } }}
        data={this.props.data}
        x="title"
        y="score"
      />
      <VictoryBar
        animate={{ onLoad: { duration: 1000 } }}
        data={this.props.data}
        x="title"
        y="visits"
      />
      </VictoryGroup>

      <VictoryLabel dx={100} y={10}
        style={ {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                 fill: "rgb(69, 90, 100)", fontWeight: "bold", fontSize: 23} }
        text="Puntos y Visitas"
      />

      <VictoryLabel dx={130} y={30}
        style={ {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                 fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 12} }
        text="Visitas VS Puntos Top 3"
      />

      <VictoryLegend
        style={ {labels: {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                 fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 12} }}
        x={260}
        y={80}
        data={[
          {name: 'Puntos', symbol: { type: 'square', fill: '#000000' }},
          {name: 'Visitas', symbol: { type: 'square', fill: '#EBEBEB' }}
        ]}
      />

      </VictoryChart>
    )
  }
}

class PieChart extends React.Component {
    render() {
        return (
          <div>
            <h1 style = {
                {
                    fontSize: 26,
                    fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                    color: "rgb(69, 90, 100)",
                    fontWeight: "bold",
                    margin: "0"
                }
            }
            > Categorias en Tops </h1>

            <svg width = {"100%"} height = {"450"} viewBox = "-100 0 600 450">

            <VictoryPie events = {
                [{
                    target: "data",
                    eventKey: [0, 2, 4],
                    eventHandlers: {
                        onMouseOver: () => {
                            return [{
                                mutation: (props) => {
                                    return {
                                        style: Object.assign({}, props.style, {
                                            opacity: 0.7
                                        })
                                    };
                                }
                            }, {
                                target: "labels",
                                mutation: () => {
                                    return {
                                        text: (d) => d.y
                                    };
                                }
                            }];
                        },
                        onMouseOut: () => {
                            return [{
                                mutation: () => {
                                    return null;
                                }
                            }, {
                                target: "labels",
                                mutation: () => {
                                    return null;
                                }
                            }];
                        }
                    }
                }]
            }

            labelRadius = {190}
            theme = {VictoryTheme.material}
            animate = {
                {
                    onLoad: {
                        duration: 1000
                    }
                }
            }
            style = {
                {
                    parent: {
                        overflow: "visible"
                    },
                    labels: {
                        fontSize: 13,
                        fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                        fill: "rgb(69, 90, 100)",
                        fontWeight: 100,
                        overflow: "visible"
                    }
                }
            }
            data = {this.props.data}
            x = "Category"
            y = "Num"

            />

            </svg>
          </div>
        )
    }
}

export default App;

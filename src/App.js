import React from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis,
   VictoryGroup, VictoryTheme, VictoryLegend,
 VictoryLabel, VictoryPie } from 'victory';
import Button from 'muicss/lib/react/button';
import Loader from 'react-loader'

const dailyTop = "https://www.mocky.io/v2/5d9d15ac31000016c92fc92b" // https://pastebin.com/yAV3gQtb
const weeklyTop = "https://www.mocky.io/v2/5d9d1d7c3100002f262fc944" // https://pastebin.com/jDRwPMZV
const monthlyTop = "https://www.mocky.io/v2/5d9d1ee031000038c92fc947" // https://pastebin.com/fNfJkTAG
const allTimeTop = "https://www.mocky.io/v2/5d9d167b31000038c92fc92c" // https://pastebin.com/tENKBZGF

// Crea la tabla con el titulo, puntos y visitas de los post. 
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

  // Se usa la libreria axios para leer respuestas GET. 
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
      arr.push(x.category_name.toLowerCase())
   })

   arr.forEach(function(i) {
     count[i] = (count[i]||0)+1;
   });


   for(let key in count){myArr.push({"Category" : key, "Num" : count[key]})}


       if (this.state.charttype === "barChart") {
         chart = (<div style={{border: "1px solid #d1d5da", borderRadius: "3px", padding: "28px", margin: "10px 30px", maxWidth: "600px"}}><Chart data={this.state.datasource.slice(0,3)}/></div>)
       } else if (this.state.charttype === "pieChart") {
         chart = (<div style={{border: "1px solid #d1d5da", borderRadius: "3px", padding: "28px", margin: "10px 30px", maxWidth: "600px"}}><PieChart data={myArr}/></div>)
       } else if (this.state.charttype === "info") {
         chart = (<Info  data={this.state.datasource}/>)
       }

  // Si la API devueulve datos, organiza los botones y tabla sin datos.
  if (this.state.datasource.length !== 0) {

    return (
      <Loader loaded={this.state.loaded}>
      <div>
        <h1 style={{fill: "rgb(69, 90, 100)", fontWeight: 100}}>¡Taringa Stats!</h1>

        <div id="left">
        	
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

        </div>


        <div id="right">
	        <div className="mui--text-center">
	        <Button onClick={this.changeToBar} > <i className="fa fa-bar-chart">   </i> </Button>
	        <Button onClick={this.changeToPie} > <i className="fa fa-pie-chart">   </i> </Button>
	        <Button onClick={this.changeToInfo}> <i className="fa fa-file-text-o"> </i> </Button>
	        </div>
	        {chart}
	        </div>
	    </div>
      </Loader>
    )
  } else {   // Mensaje de error si no hay datos en la API.

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

// División para documentación / información básica de la app. 
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
      <div style={{padding: "32px", margin: "10px 30px", maxWidth: "600px", height: "auto", fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 16, textAlign: "left", border: "1px solid #d1d5da", borderRadius: "3px"}}>
        <p>Aplicación web creada para <a href="https://www.taringa.net/+taringa/cree-una-aplicacion-web-para-taringa-y-te-lo-muestro_waj4t" target="_blank" rel="noopener noreferrer">Taringa</a>. Organiza y visualiza estadísticas sobre los top post en tiempo real usando la <a href="http://api.taringa.net/docs/taringa/home.html" target="_blank" rel="noopener noreferrer">API oficial</a> (descontinuada).</p>
        <p>Visualiza los puntos contra las visitas y distribución de categorías de los top post en cada periodo de tiempo. Algunos datos interesantes:</p>
        <ul>
  			<li>Promedio de puntos recibidos en top posts es: {Math.round(arrScores.reduce((x,y) => x+y,0)/arrScores.length)}</li>
  			<li>Promedio de seguidores en los top posts es: {Math.round(arrFollows.reduce((x,y) => x+y,0)/arrFollows.length)}</li>
  			<li>Promedio de comentarios en los top posts es: {Math.round(arrComments.reduce((x,y) => x+y,0)/arrComments.length)}</li>
		</ul>
        <p>Creado por <a href="https://github.com/andrescuco/taringa-stats" target="_blank" rel="noopener noreferrer">@andrescuco</a>.</p>
      </div>

    )
  }
}

class Chart extends React.Component {
  render() {

    return (
      <VictoryChart
        containerComponent={<svg height="100%" viewBox="-190 0 750 330"></svg>}
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

      <VictoryLegend 
        symbolSpacer={3}
        y={100}
        data={[
          {name: 'Puntos', symbol: { type: 'square', fill: '#000000' }},
          {name: 'Visitas', symbol: { type: 'square', fill: '#EBEBEB' }}
        ]}
      />	

      <VictoryLabel dx={85} y={10}
        style={ {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                 fill: "rgb(69, 90, 100)", fontWeight: "bold", fontSize: 23} }
        text="Puntos vs Visitas"
      />

      <VictoryLabel dx={166} y={30}
        style={ {fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                 fill: "rgb(69, 90, 100)", fontWeight: 100, fontSize: 12} }
        text="Top 3"
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
                    fontSize: 30,
                    fontFamily: "Roboto, 'Helvetica Neue', Helvetica, sans-serif",
                    color: "rgb(69, 90, 100)",
                    fontWeight: "bold",
                    margin: "0"
                }
            }
            > Categorias en tops </h1>

            <svg viewBox = "-250 0 900 410">

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
                                            opacity: 0.8
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
            theme = {VictoryTheme.grayscale}
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

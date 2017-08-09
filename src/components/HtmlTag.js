import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Navbar, FormGroup, FormControl, Button, Grid, Col, Row } from 'react-bootstrap'

//Using JQuery here because its the most straight forward method I could find.


require('isomorphic-fetch')
const prism = require('prismjs')

export class HtmlTag extends Component {
    constructor(props){
        super(props);
        this.state = {
            $html: null,
            url: '',
            enteredValidLink: false //indicates a response was received from the server.
        }
    }

    //using jquery to alter the document
    showHtml = () => {
        $('.code-container').append(this.state.$html)
        this.registerListeners()
    }

    registerListeners = () => {
        const $tokens = $("span.token.tag > span.token.tag")
        $tokens.click(e => {
            this.removeAllColor()
            //find opening and closing tags
            const tag = $(e.target).text()
            const alternateTag = tag.slice(1,2) == '/' ? tag.slice(0,1) +  tag.slice(2, tag.length) : tag.slice(0,1) + '/' + tag.slice(1, tag.length)
            //filter document and color all opening and closing tags clicked red
            $tokens.filter(index => {
                const currentElement = $($tokens[index])
                if (currentElement.text() === tag || currentElement.text() === alternateTag){
                    currentElement.parents('span.token.tag').css('color', 'red')
                }
            })
        })
    }

    removeAllColor = () => {
        const $tokens = $('span.token.tag')
        $tokens.each(index => {
            $($tokens[index]).removeAttr('style')
        })
    }

    //on submit, empty the container and reset state html variable.
    handleSubmit = () => {
        $('.code-container').empty()
        this.setState({
            $html: null,
            enteredValidLink: false
        })
        this.getFileAsString('https://flask-json-api.herokuapp.com/html').then(responseText => {
            const rawHTML = responseText
            let html = $.parseHTML(rawHTML)
            html = $('.code-container').append($(html).clone()).html()
            $('.code-container').empty()

            //wrap valid HTML in span elements
            const highlightedCode = prism.highlight(html, prism.languages.html)
            this.setState({
                $html: $(highlightedCode),
                enteredValidLink: true
            })
        })
    }

    //returns an HTML file as a string
    getFileAsString = (path) => {
        const url = this.state.url
        return fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'url': url
            })
        }).then(res => {
            return res.text()
        })
    }

    //when a user begins to type, empty the container and prepare for a new URL if a valid URL was previously entered.
    handleTextChange = (e) => {
        if(this.state.enteredValidLink){
            $('.code-container').empty()
            this.setState({
                html: null,
                enteredValidLink: false
            })
        }

        this.setState({url : e.target.value})
    }

    render(){
        //renders search bar via react-bootstrap
        const searchBar = (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                      <a>Please enter a URL. Make sure to include http/https prefix in the address.</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Form pullLeft>
                      <FormGroup>
                        <FormControl type="text" placeholder="https://www.reddit.com" onChange={this.handleTextChange}/>
                      </FormGroup>
                      {' '}
                      <Button type="submit" onClick={ this.handleSubmit }>Submit</Button>
                    </Navbar.Form>
                </Navbar.Collapse>
            </Navbar>
        )
        const info = (
            <Grid>
                <Row className="show-grid">
                    <Col md={6} mdOffset={3}><p>Generated a bundle file from a React/Webpack application and placed it on a simple Flask app. 
                    Code for fetching the HTML seen below. Click on the name of the html element to highlight.</p></Col>
                    <Col md={6} mdOffset={3}>
                        <pre>
                        @app.route('/html', methods=['POST'])
                        def test():
                            url = request.json.get('url')
                            headers= {'{'} 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36' {'}'} 
                            req = urllib.request.Request(url, None, headers)
                            with urllib.request.urlopen(req) as url:
                                s = url.read()
                            return s
                        </pre>
                    </Col>
                </Row>
            </Grid>
        )
        return (
            <div className='container'>
                { searchBar}
                { info }
                <div className="code-container">
                    {this.state.enteredValidLink ? this.showHtml() : null}
                </div>
            </div>
        )
    }
}

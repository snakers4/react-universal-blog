// Footer.js
import React, { Component } from 'react'

export default class Footer extends Component {

  render(){
    
    const data = this.props.data  
    let footer_text
    if(data.globals.text){
      footer_text = data.globals.text.footer_text
    }

    let telegram

    if(data.globals.social){
      telegram = data.globals.social.telegram
    }

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
              <ul className="list-inline text-center">
                <li>
                  <a href={ telegram } target="_blank">
                    <span className="fa-stack fa-lg">
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className="fa fa-telegram fa-stack-1x fa-inverse"></i>
                    </span>
                  </a>
                </li>
              </ul>
              <p className="copyright text-muted" dangerouslySetInnerHTML={{__html: footer_text }}></p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
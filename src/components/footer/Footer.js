
import React, { Component } from 'react'
import { runInThisContext } from 'vm';

class Footer extends Component 
{

    render(){

        return (
                <footer className="main-footer" >
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 0.0.1
                    </div>
                    <strong>Powered by &copy; 2020 <a href="http://www.brainiuminfotech.com/">Brainium Information Technologies
                            Pvt. Ltd.</a></strong> All rights reserved.
                </footer>
            )
        }
}


export default Footer
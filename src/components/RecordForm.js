import React, { Component } from 'react';
import * as RecordsAPI from '../utils/RecordsAPI'



export default class RecordForm extends Component {
    constructor(props){
        super(props);
        this.state={
            date:"",
            title:"",
            amount:""
        }
    }
    valid(){
        return this.state.date&&this.state.title&&this.state.amount
    }
    handleChange(event){
        let name = event.target.name;
        let obj;
        this.setState(
            (obj={},
            obj[""+name]=event.target.value,
            obj)
        )
    }
    handleSubmit(event){
        event.preventDefault();//js语法，阻止默认行为为get
        const data={
            date:this.state.date,
            title:this.state.title,
            amount:Number.parseInt(this.state.amount,0)
        };
        RecordsAPI.create(data).then(
            response=>{
                this.props.handleNewRecord(response.data);
                this.setState({
                    date:"",
                    title:"",
                    amount:""
                })
            }  
        ).catch(
            error=>console.log(error.message)
        );
    }
    render() {
        return (
            <form className="form-inline mb-1" onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group mr-1">
                    <input type="text" className="form-control" name="date" placeholder="Date:2018-02-22" value={this.state.date}
                    onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="form-group mr-1">
                    <input type="text" className="form-control" name="title" placeholder="Title:income" value={this.state.title}
                    onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="form-group mr-1">
                    <input type="text" className="form-control" name="amount" placeholder="11" value={this.state.amount}
                    onChange={this.handleChange.bind(this)}/>
                </div>
                <button type="submit" className="btn btn-primary" disabled={!this.valid()}>创建新记录</button>
            </form>
        )
    }
}
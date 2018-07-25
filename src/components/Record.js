import React, { Component } from 'react';
import PropTypes from 'prop-types'
import * as RecordsAPI from '../utils/RecordsAPI'

export default class Record extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        };
    }

    //点击编辑、取消，切换编辑状态
    handleToggle() {
        this.setState({
            edit: !this.state.edit
        });
    }

    handleEdit(event) {
        event.preventDefault();//js语法，阻止默认行为为get
        const record = {
            date: this.refs.date.value,//获取input中的新值
            title: this.refs.title.value,
            amount: Number.parseInt(this.refs.amount.value, 0)
        }
        RecordsAPI.update(this.props.record.id, record).then(
            response => {
                this.setState({ edit: false });//更新后恢复不可编辑状态
                //传参给Records.js(原纪录，新纪录))
                this.props.handleEditRecord(this.props.record, response.data);

            }
        ).catch(
            error => console.log(error.message)
        );
    }
    handleDelete(event){
        event.preventDefault();
        RecordsAPI.remove(this.props.record.id).then(
            response=>{
                this.props.handleDeleteRecord(this.props.record)
            }
        ).catch(
            error => console.log(error.message)
        );
    }
    //不可编辑状态
    recordRow() {
        return (
            <tr>
                <td>{this.props.record.date}</td>
                <td>{this.props.record.title}</td>
                <td>{this.props.record.amount}</td>
                <td>
                    <button className="btn btn-info mr-1" onClick={this.handleToggle.bind(this)}>编辑</button>
                    <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>删除</button>
                </td>
            </tr>

        );
    }
    //可编辑状态
    recordForm() {
        return (
            <tr>
                {/* 即使用input,默认值为原值 defaultValue={this.props.record.date} ref:标记该input*/}
                <td><input type="text" className="form-control" defaultValue={this.props.record.date} ref="date" /></td>
                <td><input type="text" className="form-control" defaultValue={this.props.record.title}
                    ref="title" /></td>
                <td><input type="text" className="form-control" defaultValue={this.props.record.amount}
                    ref="amount" /></td>
                <td>
                    <button className="btn btn-info mr-1" onClick={this.handleEdit.bind(this)}>更新</button>
                    <button className="btn btn-danger" onClick={this.handleToggle.bind(this)}>取消</button>
                </td>
            </tr>

        );
    }
    render() {
        if (this.state.edit) {
            return this.recordForm();
        }
        else {
            return this.recordRow();//列表不可编辑状态
        }

    }
}
Record.propTypes = {
    id: PropTypes.string,
    date: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.number
}
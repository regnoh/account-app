import React, { Component } from 'react';
import Record from './Record';
import * as RecordsAPI from '../utils/RecordsAPI'
import RecordForm from './RecordForm';
import AmountBox from './AmountBox';


export default class Records extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
            isLoaded: false,//初始未加载完
            records: []
        }
    }
    componentDidMount() {
        //axios.get("https://5b56f6f688d93a0014b024ab.mockapi.io/api/v1/records")
        RecordsAPI.getAll()
            .then(
                response => this.setState({
                    records: response.data,
                    isLoaded: true//无论响应成功与否，都是在加载完后
                })
            )
            .catch(
                error => this.setState({
                    error,
                    // key和value相同，只写一个即可，相当于error:error
                    isLoaded: true
                })
            )
    }
    addRecord(record) {
        this.setState({
            error: null,
            isLoaded: true,//加载完
            records: [
                ...this.state.records,//历史记录
                record//新纪录
            ]
        })
    }
    //https://cloud.tencent.com/developer/section/1374244
    updateRecord(record, data) {//传入（原纪录，新纪录）
        const recordIndex = this.state.records.indexOf(record);
        const newRecords = this.state.records.map((item, index) => {
            if (index !== recordIndex) {
                // This isn't the item we care about - keep it as-is
                return item;
            }
            // Otherwise, this is the one we want - return an updated value
            return {
                ...item,
                ...data
            };
        });
        this.setState({
            records: newRecords
        })
    }
    deleteRecord(record){//传要删除的纪录，而不是id
            const recordIndex = this.state.records.indexOf(record);
            const newRecords = this.state.records.filter( (item, index) => index !== recordIndex);
            this.setState({
                records:newRecords
            })
        }
    credit(){
        let credits = this.state.records.filter((record)=>{
            return record.amount>=0;
        })
        return credits.reduce((prev,curr)=>{
            return prev+Number.parseInt(curr.amount,0)
        },0)//reduce(函数，初始值)  
    }
    debit(){
        let debits = this.state.records.filter((record)=>{
            return record.amount<0;
        })
        return debits.reduce((prev,curr)=>{
            return prev+Number.parseInt(curr.amount,0)
        },0)//reduce(函数，初始值)  
    }
    balance(){
        return this.credit()+this.debit()
    }
    render() {
        //es6写法
        const { error, isLoaded, records } = this.state;
        if (error) {
            return <div>Error:{error.message}</div>
        }
        else if (!isLoaded) {
            return <div>Loading......</div>
        } else {
            return (
                <div>
                    <div className="row mb-3">
                    <AmountBox text="Credit" type="success" amount={this.credit()}/>
                    <AmountBox text="Debit" type="danger" amount={this.debit()}/>
                    <AmountBox text="Balance" type="success" amount={this.balance()}/>
                    </div>
                    <RecordForm handleNewRecord={this.addRecord.bind(this)} />
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>时间</th>
                                <th>事项</th>
                                <th>金额</th>
                                <th>处理</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {...record}改为record={record}，在record.js中this.props.date改为this.props.record.date */}
                            { records.map((record) =>(//跨行要用括号包起来
                                <Record 
                                    key={record.id} 
                                    record={record} 
                                    handleEditRecord={this.updateRecord.bind(this)} 
                                    handleDeleteRecord={this.deleteRecord.bind(this)}   
                                />
                               ))}
                        </tbody>
                    </table>

                </div>
            );
        }
    }
}

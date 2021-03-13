import React from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import LogList from "./LogList";

class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      tableData: [],
      orgtableData: [],
      perPage: 10,
      currentPage: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.loadMoreData(this.state.currentPage);
      }
    );
  };

  loadMoreData(page) {
    this.getData(page);
  }

  componentDidMount() {
    this.getData(1);
  }

  getData(page) {
    console.log(page);
    axios
      .get(`http://localhost:8081/api/room/list?page=${page + 1}`)
      .then((res) => {
        let total_page = res.data.count / 10;
        this.setState({
          pageCount: total_page,
          tableData: res.data.rows,
        });
      });
  }
  render() {
    return (
      <>
        <div className="container">
          <h1>전체채팅 대화 내역</h1>
          <br></br>
          <table className="table">
            <thead className="thead-dark">
              <th scope="col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;채팅 번호</th>
              <th scope="col">채팅방</th>
              <th scope="col">채팅아이디</th>
              <th scope="col">채팅메세지</th>
              <th scope="col">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;채팅날짜
              </th>
            </thead>
            {this.state.tableData
              ? this.state.tableData.map((k) => {
                  return (
                    <LogList
                      key={k.idx}
                      idx={k.idx}
                      chat_room={k.chat_room}
                      chat_id={k.chat_id}
                      chat_msg={k.chat_msg}
                      createdAt={k.createdAt}
                    />
                  );
                })
              : "DB ERROR !! 조그만 기다려주세요."}
          </table>
          <div>
            <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              pageRangeDisplayed={10}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              marginPagesDisplayed={2}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </>
    );
  }
}
export default Log;

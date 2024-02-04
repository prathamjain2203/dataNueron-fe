import logo from "./logo.svg";
import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import SampleSplitter from "./Components/SampleSplitter/SampleSplitter";
import { useResizable } from "react-resizable-layout";
import { cn } from "./utils/cn";
import { Button, Form, Input, Table } from "antd";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import ModifyForm from "./Components/ModifyForm/ModifyForm";
import { useForm } from "antd/es/form/Form";

function App() {
  const [count, setCount] = useState({});
  const [getData, setGetData] = useState([]);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [rowData, setRowData] = useState(false);
  const [addForm] = useForm();

  const onEditClick = (row) => {
    setOpenModifyModal(true);
    setRowData(row);
  };
  const {
    isDragging: isTerminalDragging,
    position: terminalH,
    splitterProps: terminalDragBarProps,
  } = useResizable({
    axis: "y",
    initial: 150,
    min: 50,
    reverse: true,
  });
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 700,
    min: 50,
  });
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    splitterProps: pluginDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 400,
    min: 50,
    reverse: true,
  });
  const columns = [
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
    },
    {
      key: "age",
      dataIndex: "age",
      title: "Age",
    },
    {
      key: "edit",
      dataIndex: "edit",
      title: "Edit",
      render: (item, row) => {
        return (
          <CiEdit
            onClick={() => onEditClick(row)}
            style={{ cursor: "pointer" }}
            size={30}
          />
        );
      },
    },
  ];

  // calling api to add data
  const addData = useCallback(async (values) => {
    try {
      const response = await axios.post(
        "https://dataneuron.onrender.com/api/v1/data/add",
        {
          name: values?.name,
          email: values?.email,
          age: values?.age,
        }
      );
      toast.success(response?.data?.message);
      getAllData();
      getCount();
      addForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // calling api to add data
  const getCount = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://dataneuron.onrender.com/api/v1/data/count"
      );
      setCount(response?.data?.count);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getAllData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://dataneuron.onrender.com/api/v1/data/all"
      );
      setGetData(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getCount();
    getAllData();
  }, [getCount, getAllData]);
  return (
    <div
      className={
        "flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"
      }
    >
      <Toaster />

      <div className={"flex grow"}>
        <div
          className={cn("shrink-0 contents", isFileDragging && "dragging")}
          style={{ width: fileW }}
        >
          <Table
            columns={columns}
            pagination={false}
            style={{ width: "90%", overflow: "scroll", height: "200px" }}
            dataSource={getData || []}
          />
        </div>
        <SampleSplitter isDragging={isFileDragging} {...fileDragBarProps} />
        <div className={"flex grow"}>
          <div className={"grow bg-darker contents"}>
            <Form className="add_data_form" onFinish={addData} form={addForm}>
              <div className="field-container">
                <label>Name:</label>
                <Form.Item name="name">
                  <Input type="text" />
                </Form.Item>
              </div>
              <div className="field-container">
                <label>Email:</label>
                <Form.Item name="email">
                  <Input type="email" />
                </Form.Item>
              </div>
              <div className="field-container">
                <label>Age:</label>
                <Form.Item name="age">
                  <Input type="number" />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form>
          </div>
          <SampleSplitter
            isDragging={isPluginDragging}
            {...pluginDragBarProps}
          />
          <div
            className={cn("shrink-0 contents", isPluginDragging && "dragging")}
            style={{ width: pluginW }}
          >
            <img src="data:image/jpeg;base64,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" />
          </div>
        </div>
      </div>
      <SampleSplitter
        dir={"horizontal"}
        isDragging={isTerminalDragging}
        {...terminalDragBarProps}
      />
      <div
        className={cn(
          "shrink-0 bg-darker contents",
          isTerminalDragging && "dragging"
        )}
        style={{ height: terminalH }}
      >
        <span>No of times Add Data API Called: {count?.addCount}</span>
        <span>No of times Update Data API Called: {count?.updateCount}</span>
      </div>
      <ModifyForm
        openModifyModal={openModifyModal}
        setOpenModifyModal={setOpenModifyModal}
        row={rowData}
        getAllData={getAllData}
        getCount={getCount}
      />
    </div>
  );
}

export default App;

import React, { useCallback, useEffect } from "react";
import { StyledModifyForm } from "./Modify.styles";
import { Button, Form, Input } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "antd/es/form/Form";

const ModifyForm = ({
  openModifyModal,
  setOpenModifyModal,
  row,
  getAllData,
  getCount,
}) => {
  const [updateForm] = useForm();

  useEffect(() => {
    if (row) {
      updateForm.setFields([
        {
          name: "name",
          value: row?.name,
        },
        {
          name: "age",
          value: row?.age,
        },
        {
          name: "email",
          value: row?.email,
        },
      ]);
    }
  }, [row]);
  const updateData = useCallback(
    async (values) => {
      try {
        const response = await axios.put(
          `https://dataneuron.onrender.com/api/v1/data/update?id=${row?._id}`,
          {
            name: values?.name,
            email: values?.email,
            age: values?.age,
          }
        );
        toast.success(response?.data?.message);
        getAllData();
        getCount();
        setOpenModifyModal(false);
      } catch (err) {
        console.log(err);
      }
    },
    [row, getAllData, getCount]
  );
  const handlecancel = () => {
    setOpenModifyModal(false);
  };
  return (
    <StyledModifyForm
      open={openModifyModal}
      footer={null}
      onCancel={handlecancel}
    >
      <Form form={updateForm} className="add_data_form" onFinish={updateData}>
        <div classNam e="field-container">
          <label className="label">Name:</label>
          <Form.Item name="name">
            <Input type="text" />
          </Form.Item>
        </div>
        <div className="field-container">
          <label className="label">Email:</label>
          <Form.Item name="email">
            <Input type="email" />
          </Form.Item>
        </div>
        <div className="field-container">
          <label className="label">Age:</label>
          <Form.Item name="age">
            <Input type="number" />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </StyledModifyForm>
  );
};

export default ModifyForm;

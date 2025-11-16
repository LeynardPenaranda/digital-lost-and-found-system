import { UploadMultipleLostItemImagesAndreturnURL } from "@/lib/image-upload";
import { UserState } from "@/redux/userSlice";
import { createLostItemReport } from "@/server-actions/lost-items-report";
import { Form, Input, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const LostItemModal = ({
  onOpenModal,
  setOnOpenModal,
}: {
  onOpenModal: boolean;
  setOnOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  // Check form values whenever fields or fileList change
  const checkCanSubmit = () => {
    const values = form.getFieldsValue();
    const hasFormData =
      (values.item && values.item.trim() !== "") ||
      (values.location && values.location.trim() !== "") ||
      (values.itemDescription && values.itemDescription.trim() !== "");
    const hasFiles = fileList.length > 0;

    setCanSubmit(hasFormData || hasFiles);
  };

  const onSend = async () => {
    try {
      setLoading(true);
      // Validate form fields
      const values = await form.validateFields(); // get form values

      // Get selected files
      const files = fileList.map((f) => f.originFileObj as File);

      // Upload images if any
      let uploadedImages: string[] = [];
      if (files.length > 0) {
        uploadedImages = await UploadMultipleLostItemImagesAndreturnURL(files);
      }

      // Create report
      const response = await createLostItemReport({
        reportedBy: currentUserData?._id!,
        item: values.item,
        location: values.location,
        itemDescription: values.itemDescription,
        lostItemsImages: uploadedImages,
      });

      if (!response.success) {
        message.error(response.message);
        return;
      }

      message.success("Lost item report uploaded.");
      form.resetFields();
      setFileList([]);
      setOnOpenModal(false);
    } catch (error: any) {
      message.error(error.message || "Please fill all the required fields");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={onOpenModal}
      onCancel={() => setOnOpenModal(false)}
      title="REPORT LOST ITEM"
      okText="Upload"
      onOk={onSend}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ disabled: loading || !canSubmit }}
    >
      <Form layout="vertical" form={form} onFieldsChange={checkCanSubmit}>
        <Form.Item label="Your Name">
          <Input value={currentUserData?.name || "Unknown"} disabled />
        </Form.Item>

        <Form.Item name="item" label="Item Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location Lost"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="itemDescription"
          label="Item Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="lostItemsImages"
          label="Lost Item Images"
          rules={[
            {
              validator: (_, value) => {
                if (fileList.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please upload at least one image.")
                );
              },
            },
          ]}
        >
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false} // prevent auto upload
            onChange={({ fileList }) => {
              setFileList(fileList);
              checkCanSubmit(); // update canSubmit
            }}
          >
            <span className="p-5 text-xs text-gray-500">
              Click here to select lost item images
            </span>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LostItemModal;

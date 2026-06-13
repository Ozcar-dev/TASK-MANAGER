import { Schema, model, Document, ValidatorProps } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  category: "Urgent" | "Important" | "Completed";
  completed: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    dueDate: {
  type: Date,
  required: [true, "Due date is required"],
  validate: {
    validator: (value: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return value >= today;
    },
    message: (props: ValidatorProps): string =>
      `Due date must be at least one week from today. You provided ${props.value}.`,
  },
},
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
      values: ["Urgent", "Important", "Completed"],
      message: "Category must be Urgent, Important or Completed",
    },
},
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<ITask>("Task", taskSchema);
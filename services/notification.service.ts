import instance from "@/lib/axios/instance";

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  isRead: boolean;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

const notificationService = {
  async findAll(page = 1, limit = 20): Promise<NotificationResponse> {
    const response = await instance.get(`/notification?page=${page}&limit=${limit}`);
    return response.data;
  },

  async countUnread(): Promise<{ data: { count: number } }> {
    const response = await instance.get("/notification/unread-count");
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await instance.patch(`/notification/${id}/mark-read`);
  },

  async markAllRead(): Promise<void> {
    await instance.patch("/notification/mark-all-read");
  },
};

export default notificationService;

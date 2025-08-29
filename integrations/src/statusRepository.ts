export interface ActionStatusRepository {
  save(update: { id: string; status: string; assignee?: string | null }): Promise<void>;
}

export const defaultStatusRepository: ActionStatusRepository = {
  async save() {
    // Placeholder: persist to database or enqueue update
    return Promise.resolve();
  },
};

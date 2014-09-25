class ChangeProfilePictures < ActiveRecord::Migration
  def change   
    remove_column :profiles, :picture_url
     
      add_column :profiles, :picture_file_name, :string
      add_column :profiles, :picture_content_type, :string
      add_column :profiles, :picture_file_size, :string
      add_column :profiles, :picture_updated_at, :string
  end
end

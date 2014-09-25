class AddPictureUrlToProfile < ActiveRecord::Migration  
  def change
    remove_column :profiles, :picture_file_name
    remove_column :profiles, :picture_content_type
    remove_column :profiles, :picture_file_size
    remove_column :profiles, :picture_updated_at
     
    change_table :profiles do |t|  
      t.string :picture_url
    end
  end
end

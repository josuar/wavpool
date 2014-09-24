class ChangeProfilePictures < ActiveRecord::Migration
  def change   
    remove_column :profiles, :picture_url
     
    change_table :profiles do |t|  
      t.attachment :picture
    end
  end
end

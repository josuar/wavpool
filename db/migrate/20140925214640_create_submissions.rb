class CreateSubmissions < ActiveRecord::Migration
  def change
    create_table :submissions do |t|
      t.string :title, null: false
      t.string :remote_url, null: false
      t.string :image_url, null: false
      t.text :description
      t.integer :user_id, null: false

      t.timestamps
    end
    
    add_index :submissions, :user_id
  end
end

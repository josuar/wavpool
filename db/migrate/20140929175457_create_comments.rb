class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :user_id, null: false
      t.integer :submission_id, null: false
      t.integer :track_timestamp
      t.text :content, null: false

      t.timestamps
    end
    
    add_index :comments, :user_id
    add_index :comments, :submission_id
  end
end

class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.string :user_id, null: false
      t.string :display_name, null: false
      t.string :full_name
      t.string :location
      t.text :description

      t.timestamps
    end
    
    add_index :profiles, :user_id, unique: true
  end
end

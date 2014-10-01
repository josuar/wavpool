class RemovePositionFromComments < ActiveRecord::Migration
  def change
    remove_column :comments, :track_position
  end
end

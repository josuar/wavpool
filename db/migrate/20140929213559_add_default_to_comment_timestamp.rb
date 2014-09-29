class AddDefaultToCommentTimestamp < ActiveRecord::Migration
  def change
    change_column :comments, :track_timestamp, :integer, default: 0
    change_column :comments, :track_position, :integer, default: 0
  end
end

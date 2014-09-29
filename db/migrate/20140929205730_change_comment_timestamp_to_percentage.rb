class ChangeCommentTimestampToPercentage < ActiveRecord::Migration
  def change
    add_column :comments, :track_position, :integer
  end
end

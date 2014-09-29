class AddLikesCountCacheToSubmission < ActiveRecord::Migration
  def change
    add_column :submissions, :likes_count, :integer
  end
end

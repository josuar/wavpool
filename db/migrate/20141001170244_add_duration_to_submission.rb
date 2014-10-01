class AddDurationToSubmission < ActiveRecord::Migration
  def change
    add_column :submissions, :duration, :integer
  end
end

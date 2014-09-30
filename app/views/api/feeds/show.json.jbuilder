json.submissions @feed do |submission|
  json.partial! 'api/submissions/submission_terse', submission: submission
end
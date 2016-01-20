/**
 * Created by kyle_jeter on 11/19/15.
 */

var ArticleBox = React.createClass({

	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data:data})
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(this.props.url, status, err)
			}.bind(this)
		});
	},
	handleArticleSubmit: function(article) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: article,
			success: function(data) {
				this.setState({data: [data]})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString())
			}.bind(this)
		});
	},
	getInitialState: function () {
		return {data: []}
	},
	componentDidMount: function () {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function () {
		return (
			<div className="articleBox">
				<h1>Articles</h1>
				<ArticleList data={this.state.data} />
				<ArticleForm onArticleSubmit={this.handleArticleSubmit} />
			</div>
		);
	}
});

var ArticleList = React.createClass({
	render: function() {
        debugger
		var articleNodes = this.props.data.map(function(article) {
			return (
				<Article author={article.author} title={article.title} key={article.id}>
					{article.content}
				</Article>
			);
		});
		return (
			<div className="articleList">
				{articleNodes}
			</div>
		);
	}
});

var Article = React.createClass({
	render: function () {
		return (
			<div className="article">
				<h2 className="articleAuthor">
					{this.props.author}
				</h2>
				<h3 className="articleTitle">
					{this.props.title}
				</h3>
				{this.props.children}
			</div>
		)
	}
});

var ArticleForm = React.createClass({
	getInitialState: function() {
		return {author: '', title: '', content:''};
	},
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	handleTitleChange: function(e) {
		this.setState({title: e.target.value});
	},
	handleContentChange: function(e) {
		this.setState({content: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var title = this.state.title.trim();
		var content = this.state.content.trim();

		if (!author || !title || !content) {
			return
		}
		this.props.onArticleSubmit({author: author, title: title, content: content})
		this.setState({author: '', title: '', content: ''})
	},
	render: function() {
		return (
			<form className="articleForm" onSubmit={this.handleSubmit}>
				<input
					type="text"
					placeholder="Author"
					value={this.state.author}
					onChange={this.handleAuthorChange}
				/>
				<input
					type="text"
					placeholder="Title"
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<input
					type="text"
					placeholder="Content"
					value={this.state.content}
					onChange={this.handleContentChange}
				/>
				<input type="submit" value="Post"  />
			</form>
		);
	}
});

ReactDOM.render(
	<ArticleBox url="/api/article" pollInterval={60000} />,
	document.getElementById('content')
);

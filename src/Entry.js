import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import KeyboardArrowLeft from 'material-ui/svg-icons/image/navigate-before';
import { push } from 'react-router-redux';
import {getEntryById} from './utils';
import marked from 'marked';

const style = {
    marginRight: 20,
    float: 'right'
};

class Entry extends Component {
  render() {
    return (
        <div>
            <AppBar
                title={this.props.title}
                iconElementLeft={
                    <IconButton onClick={this.props.goHome}>
                        <KeyboardArrowLeft />
                    </IconButton>
                }
            />
            <Card>
                <CardText><div dangerouslySetInnerHTML={{__html: marked(this.props.markdown)}} /></CardText>
            </Card>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    const entry = getEntryById(state, ownProps.routeParams.id);
    return {
        title: entry.date.toString(),
        markdown: entry.markdown
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    goHome: () => dispatch(push('/'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);


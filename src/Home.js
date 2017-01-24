import React, { Component } from 'react';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import { push } from 'react-router-redux';
import marked from 'marked';
import format from 'date-fns/format';

const TITLE_DATE_FORMAT = 'dddd, MMMM Do, YYYY';

const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
);

const style = {
    marginRight: 20,
    float: 'right'
};

class Home extends Component {
  render() {
    return (
        <div>
            <AppBar title="Markdown Journal" />
            <List>
                <Subheader>Today</Subheader>
                {this.props.entries.map(entry => ([

                    <ListItem
                        leftAvatar={<Avatar icon={<EditorInsertChart />} />}
                        primaryText={format(entry.date, TITLE_DATE_FORMAT)}
                        rightIconButton={
                            <IconMenu iconButtonElement={iconButtonElement}>
                                <MenuItem onClick={this.props.editEntry(entry.id)}>Edit</MenuItem>
                                <MenuItem onClick={this.props.deleteEntry(entry.id)}>Delete</MenuItem>
                            </IconMenu>
                        }
                        secondaryText={<div dangerouslySetInnerHTML={{__html: marked(entry.markdown)}} />}
                        secondaryTextLines={2}
                        onClick={this.props.viewEntry(entry.id)}
                    />,
                    <Divider inset={true} />
                ]))}
            </List>
            <FloatingActionButton style={style} onClick={this.props.addEntry}>
                <ContentAdd />
            </FloatingActionButton>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
    // TODO, order these?
    entries: Object.keys(state.journal).map(id => state.journal[id]).sort((a, b) => {
        if (a.date === b.date) {
            return 0;
        }
        return a.date > b.date ? -1 : 1;
    })
});

const mapDispatchToProps = (dispatch) => ({
    viewEntry: (id) => () => dispatch(push(`entry/${id}`)),
    editEntry: (id) => () => dispatch(push(`entry/${id}/edit`)),
    deleteEntry: (id) => () => dispatch({type: 'DELETE_ENTRY', id}),
    addEntry: () => dispatch({type: 'ADD_ENTRY'})
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
